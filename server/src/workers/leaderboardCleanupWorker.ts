import { Job, Worker } from "bullmq";
import { and, isNotNull, sql } from "drizzle-orm";
import { db } from "../db";
import { leaderboard } from "../db/schema";
import { redisConnection } from "../queues";
import { logger } from "../utils/logger";

async function processLeaderboardCleanupJob(_: Job) {
  await db
    .update(leaderboard)
    .set({
      rank: null,
    })
    .where(
      and(
        sql`${leaderboard.lastRatedAt} < NOW() - INTERVAL '30 days'`,
        isNotNull(leaderboard.rank),
      ),
    );
}

export const leaderboardCleanupWorker = new Worker(
  "session-timeout",
  processLeaderboardCleanupJob,
  { connection: redisConnection },
);

leaderboardCleanupWorker.on("completed", (job) => {
  logger.info(`Notification job ${job.id} completed`);
});

leaderboardCleanupWorker.on("failed", (job, err) => {
  logger.error(`Notification job ${job?.id} failed`, { error: err });
});
