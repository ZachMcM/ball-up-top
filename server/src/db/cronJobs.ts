import { leaderboardCleanupQueue } from "../queues/leaderboardCleanupQueue";
import { sessionTimeoutQueue } from "../queues/sessionTimeoutQueue";
import { unratedSessionsQueue } from "../queues/unratedSessionsQueue";
import { logger } from "../utils/logger";

export async function initSessionTimeoutCronJob() {
  await sessionTimeoutQueue.add(
    "cleanup_stale_sessions",
    {},
    {
      repeat: { every: 10 * 60 * 1000 },
      jobId: "cleanup-stale-sessions",
    },
  );
  logger.info("Session timeout worker started");
}

export async function initLeaderboardCleanupCronJob() {
  await leaderboardCleanupQueue.add(
    "nullify_inactive",
    {},
    {
      repeat: {
        pattern: "0 0 * * *",
      },
    },
  );
}

export async function initUnratedSessionsCronJob() {
  await unratedSessionsQueue.add(
    "notify_unrated_sessions",
    {},
    {
      repeat: { pattern: "0 * * * *" },
      jobId: "notify-unrated-sessions",
    },
  );
  logger.info("Unrated sessions notification cron job started");
}

const cronJobsList = [
  initLeaderboardCleanupCronJob,
  initSessionTimeoutCronJob,
  initUnratedSessionsCronJob,
];

export async function initCronJobs() {
  for (const initJob of cronJobsList) {
    await initJob();
  }
}
