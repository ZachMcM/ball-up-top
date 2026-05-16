import { Worker } from "bullmq";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "../db";
import { courtSession, encounteredPlayer } from "../db/schema";
import { redisConnection } from "../queues";
import { logger } from "../utils/logger";
import { sendPushNotifications } from "../utils/pushNotifications";

async function processUnratedSessionsJob() {
  // Find completed sessions where the user hasn't rated and has at least one
  // non-skipped encountered player that hasn't been rated yet
  const pendingSessions = await db
    .selectDistinct({ userId: courtSession.userId })
    .from(courtSession)
    .innerJoin(
      encounteredPlayer,
      eq(encounteredPlayer.courtSessionId, courtSession.id),
    )
    .where(
      and(
        isNotNull(courtSession.endTime),
        eq(courtSession.hasRated, false),
        eq(encounteredPlayer.skipped, false),
        isNull(encounteredPlayer.defenseRating),
      ),
    );

  if (pendingSessions.length === 0) return;

  const userIds = pendingSessions.map((s) => s.userId);

  await sendPushNotifications({
    userIds,
    title: "Rate Your Run",
    body: "You have players from your last session waiting to be rated.",
    data: { type: "unrated_session" },
  });

  logger.info(`Sent unrated session reminders to ${userIds.length} users`);
}

export const unratedSessionsWorker = new Worker(
  "unrated_sessions",
  processUnratedSessionsJob,
  {
    connection: redisConnection,
    concurrency: 1,
  },
);

unratedSessionsWorker.on("completed", (job) => {
  logger.info(`Unrated sessions job ${job.id} completed`);
});

unratedSessionsWorker.on("failed", (job, err) => {
  logger.error(`Unrated sessions job ${job?.id} failed`, { error: err });
});
