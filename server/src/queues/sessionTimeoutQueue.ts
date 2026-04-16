import { Queue } from "bullmq";
import { redisConnection } from ".";

export const sessionTimeoutQueue = new Queue("session-timeout", {
  connection: redisConnection,
});
