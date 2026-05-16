import { leaderboardCleanupQueue } from "../queues/leaderboardCleanupQueue";
import { sessionTimeoutQueue } from "../queues/sessionTimeoutQueue";
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

const cronJobsList = [initLeaderboardCleanupCronJob, initSessionTimeoutCronJob];

export async function initCronJobs() {
  for (const initJob of cronJobsList) {
    await initJob();
  }
}
