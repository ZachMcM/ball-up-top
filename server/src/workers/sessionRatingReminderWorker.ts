import { Job, Worker } from "bullmq";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { courtSession } from "../db/schema";
import { redisConnection } from "../queues";
import {
  SessionRatingReminderJobData,
  sessionRatingReminderQueue,
} from "../queues/sessionRatingReminderQueue";
import { logger } from "../utils/logger";
import { sendPushNotification } from "../utils/pushNotifications";

const MAX_REMINDERS = 7;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

async function processSessionRatingReminderJob(
  job: Job<SessionRatingReminderJobData>,
) {
  const { courtSessionId, userId, reminderCount } = job.data;

  const session = await db.query.courtSession.findFirst({
    where: eq(courtSession.id, courtSessionId),
    columns: { hasRated: true },
  });

  if (!session || session.hasRated) return;
  if (reminderCount >= MAX_REMINDERS) return;

  await sendPushNotification({
    userId,
    title: "Rate Your Run",
    body: "You still have players from your last session waiting to be rated.",
    data: { type: "unrated_session", courtSessionId },
  });

  await sessionRatingReminderQueue.add(
    "remind_rating",
    { courtSessionId, userId, reminderCount: reminderCount + 1 },
    { delay: ONE_DAY_MS },
  );
}

export const sessionRatingReminderWorker =
  new Worker<SessionRatingReminderJobData>(
    "session_rating_reminder",
    processSessionRatingReminderJob,
    {
      connection: redisConnection,
      concurrency: 10,
    },
  );

sessionRatingReminderWorker.on("completed", (job) => {
  logger.info(`Session rating reminder job ${job.id} completed`);
});

sessionRatingReminderWorker.on("failed", (job, err) => {
  logger.error(`Session rating reminder job ${job?.id} failed`, {
    error: err,
  });
});
