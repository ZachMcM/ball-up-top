import { Worker, Job } from "bullmq";
import { eq, inArray, isNull, sql } from "drizzle-orm";
import { redisConnection } from "../queues";
import { NotificationJobData } from "../queues/notificationsQueue";
import { db } from "../db";
import {
  activity,
  court,
  courtSession,
  notificationCourt,
  rankChange,
  rating,
  user,
} from "../db/schema";
import {
  sendPushNotification,
  sendPushNotifications,
} from "../utils/pushNotifications";
import { logger } from "../utils/logger";
import {
  invalidateQueriesForUser,
  invalidateQueriesForUsers,
} from "../utils/invalidateQueries";
import { COURT_NOTI_THRESHOLD } from "../config/courts";

async function processNotificationJob(job: Job<NotificationJobData>) {
  const { data } = job;

  switch (data.type) {
    case "rating_effects": {
      // Process ratings
      if (data.ratingIds.length > 0) {
        const ratings = await db.query.rating.findMany({
          where: inArray(rating.id, data.ratingIds),
        });

        for (const r of ratings) {
          // Overall change activity and notification
          if (r.rateeOldOverall !== r.rateeNewOverall) {
            await db.insert(activity).values({
              userId: r.rateeId,
              type: "overall_change",
              ratingId: r.id,
            });

            const direction = r.rateeNewOverall > r.rateeOldOverall ? "increased" : "decreased";
            await sendPushNotification({
              userId: r.rateeId,
              title: "Overall Changed",
              body: `Your overall ${direction} to ${r.rateeNewOverall}!`,
              data: { type: "overall_change", ratingId: r.id },
            });
          }

          // Archetype change activity and notification
          if (r.rateeOldArchetype !== r.rateeNewArchetype) {
            await db.insert(activity).values({
              userId: r.rateeId,
              type: "archetype_change",
              ratingId: r.id,
            });

            await sendPushNotification({
              userId: r.rateeId,
              title: "Archetype Changed",
              body: `Your archetype is now ${r.rateeNewArchetype}!`,
              data: { type: "archetype_change", ratingId: r.id },
            });
          }

          invalidateQueriesForUser(r.rateeId, ["activity"]);
        }
      }

      // Process rank changes
      if (data.rankChangeIds.length > 0) {
        const rankChanges = await db.query.rankChange.findMany({
          where: inArray(rankChange.id, data.rankChangeIds),
        });

        for (const rc of rankChanges) {
          await db.insert(activity).values({
            userId: rc.userId,
            type: "rank_change",
            rankChangeId: rc.id,
            courtId: rc.courtId,
          });

          const msg =
            rc.oldRank === null
              ? `You entered the leaderboard at #${rc.newRank}!`
              : rc.newRank < rc.oldRank
                ? `Your rank rose to #${rc.newRank}!`
                : `Your rank dropped to #${rc.newRank}`;

          await sendPushNotification({
            userId: rc.userId,
            title: "Rank Changed",
            body: msg,
            data: { type: "rank_change", rankChangeId: rc.id },
          });

          invalidateQueriesForUser(rc.userId, ["activity"]);
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
            AND DATE(${courtSession.startTime}) = CURRENT_DATE`,
        );

      const activeCount = result?.count ?? 0;

      if (activeCount >= COURT_NOTI_THRESHOLD) {
        // TODO change this to all users with this primary court versus subscribers
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
              AND ${notificationCourt.userId} != ${data.checkingInUserId}`,
          );

        const userIds = subscribedUsers.map((s) => s.userId);

        if (userIds.length > 0) {
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
    concurrency: 10,
  },
);

notificationsWorker.on("completed", (job) => {
  logger.info(`Notification job ${job.id} completed`);
});

notificationsWorker.on("failed", (job, err) => {
  logger.error(`Notification job ${job?.id} failed`, { error: err });
});
