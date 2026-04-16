import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import { sessionTimeoutQueue } from "./queues/sessionTimeoutQueue";
import { routes } from "./routes";
import { socketServer } from "./sockets";
import { auth } from "./utils/auth";
import { limiter } from "./utils/limiter";
import { logger } from "./utils/logger";
import { notificationsWorker } from "./workers/notificationsWorker";
import { sessionTimeoutWorker } from "./workers/sessionTimeoutWorker";

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

httpServer.listen(PORT, async () => {
  logger.info(`Server listening on port ${PORT} in ${process.env.NODE_ENV}`);
  logger.info("Notifications worker started");

  await initSessionTimeoutWorker()
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, closing workers...");
  await notificationsWorker.close();
  await sessionTimeoutWorker.close()
  process.exit(0);
});

export async function initSessionTimeoutWorker() {
  await sessionTimeoutQueue.add(
    "cleanup-stale-sessions",
    {},
    {
      repeat: { every: 10 * 60 * 1000 },
      jobId: "cleanup-stale-sessions",
    },
  );
  logger.info("Session timeout worker started");
}