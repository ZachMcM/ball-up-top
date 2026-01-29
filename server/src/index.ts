import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import { auth } from "./utils/auth";
import { limiter } from "./utils/limiter";
import { logger } from "./utils/logger";
import { routes } from "./routes";
import { socketServer } from "./sockets";
import { notificationsWorker } from "./workers/notifications.worker";

const app = express();
const PORT = parseInt(process.env.PORT!);

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

socketServer(io);

app.use(cors());
app.use(morgan("combined"));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use(limiter);
app.use("/", routes);

httpServer.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT} in ${process.env.NODE_ENV}`);
  logger.info("Notifications worker started");
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, closing workers...");
  await notificationsWorker.close();
  process.exit(0);
});
