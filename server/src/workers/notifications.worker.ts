import { Worker, Job } from "bullmq";
import { eq, inArray, isNull, sql } from "drizzle-orm";
import { redisConnection } from "../queues";
import { NotificationJobData } from "../queues/notifications.queue";
import { db } from "../db";
import { activity, court, courtSession, notificationCourt, rating, user } from "../db/schema";
import { sendPushNotification, sendPushNotifications } from "../../utils/pushNotifications";
import { logger } from "../../utils/logger";
import { COURT_NOTI_THRESHOLD } from "../config/courts";

async function processNotificationJob(job: Job<NotificationJobData>) {
  const { data } = job;

  switch (data.type) {
    case "session_completed": {
      await db.insert(activity).values({
        userId: data.userId,
        type: "session_completed",
        courtSessionId: data.courtSessionId,
      });
      break;
    }

    case "ratings_activity": {
      const targetRatings = await db.query.rating.findMany({
        where: inArray(rating.id, data.ratingIds),
      });

      for (const {
        id: ratingId,
        rateeId: userId,
        rateeOldArchetype: oldArchetype,
        rateeNewArchetype: newArchetype,
        rateeOldOverall: oldOverall,
        rateeNewOverall: newOverall,
        defenseRating,
        playmakingRating,
        shootingRating,
        finishingRating,
      } of targetRatings) {
        // Insert rating_received activity
        await db.insert(activity).values({
          userId,
          type: "rating_received",
          ratingId,
        });

        // Send push notification for rating received
        const avgRating = Math.round(
          (defenseRating + playmakingRating + shootingRating + finishingRating) / 4
        );
        await sendPushNotification({
          userId,
          title: "New Rating Received",
          body: `Someone rated you ${avgRating} overall!`,
          data: { type: "rating_received", ratingId },
        });

        // Check for archetype change
        if (oldArchetype !== newArchetype) {
          await db.insert(activity).values({
            userId,
            type: "archetype_changed",
            ratingId,
          });

          await sendPushNotification({
            userId,
            title: "Archetype Changed",
            body: `Your archetype changed to ${newArchetype}!`,
            data: { type: "archetype_changed", ratingId },
          });
        }

        // Check for rating milestones
        if (
          (oldOverall < 70 && newOverall >= 70) ||
          (oldOverall < 75 && newOverall >= 75) ||
          (oldOverall < 80 && newOverall >= 80) ||
          (oldOverall < 85 && newOverall >= 85) ||
          (oldOverall < 90 && newOverall >= 90)
        ) {
          await db.insert(activity).values({
            userId,
            type: "rating_milestone",
            ratingId,
          });

          await sendPushNotification({
            userId,
            title: "Rating Milestone",
            body: `Congratulations! You reached ${newOverall} overall!`,
            data: { type: "rating_milestone", ratingId },
          });
        }
      }
      break;
    }

    case "court_threshold_check": {
      // Count active sessions at this court
      const [result] = await db
        .select({
          count: sql<number>`COUNT(*)::integer`,
        })
        .from(courtSession)
        .where(
          sql`${courtSession.courtId} = ${data.courtId}
            AND ${courtSession.endTime} IS NULL
            AND DATE(${courtSession.startTime}) = CURRENT_DATE`
        );

      const activeCount = result?.count ?? 0;

      if (activeCount >= COURT_NOTI_THRESHOLD) {
        // Get court info
        const targetCourt = await db.query.court.findFirst({
          where: eq(court.id, data.courtId),
          columns: {
            id: true,
            name: true,
          },
        });

        if (!targetCourt) break;

        // Get subscribed users (excluding the user who just checked in)
        const subscribedUsers = await db
          .select({
            userId: notificationCourt.userId,
          })
          .from(notificationCourt)
          .where(
            sql`${notificationCourt.courtId} = ${data.courtId}
              AND ${notificationCourt.userId} != ${data.checkingInUserId}`
          );

        const userIds = subscribedUsers.map((s) => s.userId);

        if (userIds.length > 0) {
          // Create activity entries
          for (const userId of userIds) {
            await db.insert(activity).values({
              userId,
              type: "court_activity",
              courtId: data.courtId,
            });
          }

          // Send push notifications
          await sendPushNotifications({
            userIds,
            title: `${targetCourt.name} is Active!`,
            body: `${activeCount} ${activeCount === 1 ? "player" : "players"} are currently playing.`,
            data: { type: "court_activity", courtId: data.courtId },
          });
        }
      }
      break;
    }
  }
}

export const notificationsWorker = new Worker<NotificationJobData>(
  "notifications",
  processNotificationJob,
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

notificationsWorker.on("completed", (job) => {
  logger.info(`Notification job ${job.id} completed`);
});

notificationsWorker.on("failed", (job, err) => {
  logger.error(`Notification job ${job?.id} failed`, { error: err });
});
