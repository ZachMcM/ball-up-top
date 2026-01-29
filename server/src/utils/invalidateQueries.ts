import { io } from "..";
import { logger } from "./logger";

export function invalidateQueries(...keys: (string | number)[][]) {
  for (const key of keys) {
    logger.debug(`Invalidating queryKey ${JSON.stringify(key)}`)
    io.of("/invalidation").emit("data-invalidated", key);
  }
}

export function invalidateQueriesForUser(userId: string, ...keys: (string | number)[][]) {
  for (const key of keys) {
    logger.debug(`Invalidating queryKey ${JSON.stringify(key)} for user ${userId}`);
    io.of("/invalidation").to(`user:${userId}`).emit("data-invalidated", key);
  }
}

export function invalidateQueriesForUsers(userIds: string[], ...keys: (string | number)[][]) {
  for (const key of keys) {
    for (const userId of userIds) {
      logger.debug(`Invalidating queryKey ${JSON.stringify(key)} for user ${userId}`);
      io.of("/invalidation").to(`user:${userId}`).emit("data-invalidated", key);
    }
  }
}