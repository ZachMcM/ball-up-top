import { logger } from "../../utils/logger";
import { Socket } from "socket.io";
import { io } from "..";

export function invalidationHandler(socket: Socket) {
  const userId = socket.handshake.auth.userId;
  socket.join(`user:${userId}`);

  logger.info(`User ${userId} connected to invalidation socket`);

  socket.on("disconnect", () => {
    logger.info(`User ${userId} disconnected from invalidation socket`);
  });
}

