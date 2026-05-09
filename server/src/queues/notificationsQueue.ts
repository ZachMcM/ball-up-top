import { Queue } from "bullmq";
import { redisConnection } from ".";

export type RatingEffect = {
  userId: string;
  oldArchetype: string;
  newArchetype: string;
  oldOverall: number;
  newOverall: number;
  oldRank: number | null;
  newRank: number;
  ratingId: number;
};

export type NotificationJobData =
  | {
      type: "rating_effects";
      ratingEffects: RatingEffect[];
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
