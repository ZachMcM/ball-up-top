import { Queue } from "bullmq";
import { redisConnection } from ".";

export const unratedSessionsQueue = new Queue("unrated_sessions", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 1000,
  },
});
