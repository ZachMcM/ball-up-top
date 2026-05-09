import { Queue } from "bullmq";
import { redisConnection } from ".";

export type NotificationJobData =
  | {
      type: "rating_effects";
      ratingIds: number[];
      rankChangeIds: number[];
    }
  | {
      type: "court_threshold_check";
      courtId: number;
      checkingInUserId: string;
    };

export const notificationsQueue = new Queue<NotificationJobData>(
  "notifications",
  {
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
  },
);
