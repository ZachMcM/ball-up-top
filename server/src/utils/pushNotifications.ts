import { inArray } from "drizzle-orm";
import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
import { db } from "../db";
import { user } from "../db/schema";
import { logger } from "./logger";

const expo = new Expo();

export async function sendPushNotifications({
  userIds,
  title,
  body,
  data = { url: "/activity" },
}: {
  userIds: string[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
}): Promise<void> {
  if (userIds.length === 0) return;

  const users = await db
    .select({
      id: user.id,
      expoPushToken: user.expoPushToken,
    })
    .from(user)
    .where(inArray(user.id, userIds));

  const messages: ExpoPushMessage[] = [];

  for (const u of users) {
    if (!u.expoPushToken) continue;
    if (!Expo.isExpoPushToken(u.expoPushToken)) {
      logger.warn(
        `Invalid Expo push token for user ${u.id}: ${u.expoPushToken}`,
      );
      continue;
    }

    messages.push({
      to: u.expoPushToken,
      sound: "default",
      title,
      body,
      data,
    });
  }

  if (messages.length === 0) return;

  const chunks = expo.chunkPushNotifications(messages);
  const tickets: ExpoPushTicket[] = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      logger.error("Error sending push notification chunk", { error });
    }
  }

  // Log any errors from tickets
  tickets.forEach((ticket, index) => {
    if (ticket.status === "error") {
      logger.error(`Push notification error for message ${index}`, {
        message: ticket.message,
        details: ticket.details,
      });
    }
  });
}

export async function sendPushNotification({
  userId,
  title,
  body,
  data = { url: "/activity" },
}: {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}): Promise<void> {
  return sendPushNotifications({ userIds: [userId], title, body, data });
}
