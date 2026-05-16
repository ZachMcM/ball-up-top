import { Queue } from "bullmq";
import { redisConnection } from ".";

export type SessionRatingReminderJobData = {
  courtSessionId: number;
  userId: string;
  reminderCount: number;
};

export const sessionRatingReminderQueue =
  new Queue<SessionRatingReminderJobData>("session_rating_reminder", {
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
