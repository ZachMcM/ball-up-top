import { Queue } from "bullmq";
import { redisConnection } from ".";

export type NotificationJobData =
  | {
      type: "session_completed";
      userId: string;
      courtSessionId: number;
    }
  | {
      type: "ratings_activity";
      ratingIds: number[];
    }
  | {
      type: "court_threshold_check";
      courtId: number;
      checkingInUserId: string;
    }
  | {
      type: "leaderboard_updated";
      courtId: number;
      rateeId: string;
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
