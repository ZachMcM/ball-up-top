import { Job, Worker } from "bullmq";
import { and, isNotNull, sql } from "drizzle-orm";
import { db } from "../db";
import { leaderboard } from "../db/schema";
import { redisConnection } from "../queues";
import { invalidateQueries } from "../utils/invalidateQueries";
import { logger } from "../utils/logger";

async function processLeaderboardCleanupJob(_: Job) {
  const affectedRows = await db
    .update(leaderboard)
    .set({
      rank: null,
    })
    .where(
      and(
        sql`${leaderboard.lastRatedAt} < NOW() - INTERVAL '30 days'`,
        isNotNull(leaderboard.rank),
      ),
    )
    .returning({ collegeId: leaderboard.collegeId });

  const uniqueCollegeIds = [...new Set(affectedRows.map((r) => r.collegeId))];
  for (const collegeId of uniqueCollegeIds) {
    invalidateQueries(["leaderboard", collegeId]);
  }
}

export const leaderboardCleanupWorker = new Worker(
  "leaderboard_cleanup_queue",
  processLeaderboardCleanupJob,
  { connection: redisConnection },
);

leaderboardCleanupWorker.on("completed", (job) => {
  logger.info(`Notification job ${job.id} completed`);
});

leaderboardCleanupWorker.on("failed", (job, err) => {
  logger.error(`Notification job ${job?.id} failed`, { error: err });
});
