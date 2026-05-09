import { Queue } from "bullmq";
import { redisConnection } from ".";

export const leaderboardCleanupQueue = new Queue("leaderboard_cleanup_queue", {
  connection: redisConnection,
});
