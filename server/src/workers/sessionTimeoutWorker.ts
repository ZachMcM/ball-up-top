import { Job, Worker } from "bullmq";
import { and, eq, isNull, lt, sql } from "drizzle-orm";
import { SESSION_TIMEOUT_HOURS } from "../config/courtSessions";
import { db } from "../db";
import { court, courtSession } from "../db/schema";
import { redisConnection } from "../queues";
import { sessionRatingReminderQueue } from "../queues/sessionRatingReminderQueue";
import { createEncounteredPlayersForSession } from "../utils/checkoutSession";
import { invalidateHomeForCollege } from "../utils/invalidateHomeForCollege";
import { invalidateQueries } from "../utils/invalidateQueries";
import { logger } from "../utils/logger";

async function processSesssionTimeoutJob(_: Job) {
  const staleSessions = await db.query.courtSession.findMany({
    where: and(
      isNull(courtSession.endTime),
      lt(
        courtSession.startTime,
        sql`now() - interval '${sql.raw(String(SESSION_TIMEOUT_HOURS))} hours'`,
      ),
    ),
  });

  if (staleSessions.length === 0) {
    return;
  }

  const now = new Date();
  const affectedCourtIds = new Set<number>();
  const sessionsNeedingReminders: Array<{ id: number; userId: string }> = [];

  for (const session of staleSessions) {
    await db.transaction(async (tx) => {
      const [updatedSession] = await tx
        .update(courtSession)
        .set({ endTime: now })
        .where(
          and(eq(courtSession.id, session.id), isNull(courtSession.endTime)),
        )
        .returning();

      if (!updatedSession) return;

      await createEncounteredPlayersForSession(
        tx,
        updatedSession,
        session.userId,
      );
      affectedCourtIds.add(session.courtId);
    });

    const finalSession = await db.query.courtSession.findFirst({
      where: eq(courtSession.id, session.id),
      columns: { hasRated: true },
    });
    if (finalSession && !finalSession.hasRated) {
      sessionsNeedingReminders.push({ id: session.id, userId: session.userId });
    }
  }

  for (const s of sessionsNeedingReminders) {
    await sessionRatingReminderQueue.add(
      "remind_rating",
      { courtSessionId: s.id, userId: s.userId, reminderCount: 0 },
      { delay: 60 * 60 * 1000 },
    );
  }

  if (affectedCourtIds.size > 0) {
    const courtKeys = [...affectedCourtIds].map(
      (id) => ["court", id] as (string | number)[],
    );
    invalidateQueries(["courts"], ...courtKeys);

    const affectedCourts = await db
      .select({ id: court.id, collegeId: court.collegeId })
      .from(court)
      .where(
        sql`${court.id} IN (${sql.join(
          [...affectedCourtIds].map((id) => sql`${id}`),
          sql`, `,
        )})`,
      );

    const uniqueCollegeIds = new Set(affectedCourts.map((c) => c.collegeId));
    for (const collegeId of uniqueCollegeIds) {
      await invalidateHomeForCollege(collegeId);
    }
  }

  logger.info(
    `Session timeout cleanup: ended ${staleSessions.length} session(s)`,
  );
}

export const sessionTimeoutWorker = new Worker(
  "session-timeout",
  processSesssionTimeoutJob,
  { connection: redisConnection },
);

sessionTimeoutWorker.on("completed", (job) => {
  logger.info(`Session timeout job ${job.id} completed`);
});

sessionTimeoutWorker.on("failed", (job, err) => {
  logger.error(`Session timeout job ${job?.id} failed`, { error: err });
});
