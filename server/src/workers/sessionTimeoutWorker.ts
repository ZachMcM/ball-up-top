import { Job, Worker } from "bullmq";
import { and, isNull, lt, sql } from "drizzle-orm";
import { SESSION_TIMEOUT_HOURS } from "../config/courtSessions";
import { db } from "../db";
import { courtSession } from "../db/schema";
import { redisConnection } from "../queues";
import { logger } from "../utils/logger";

async function processSesssionTimeoutJob(_: Job) {
  await db
    .update(courtSession)
    .set({
      endTime: sql`now()`,
    })
    .where(
      and(
        isNull(courtSession.endTime),
        lt(
          courtSession.startTime,
          sql`now() - interval '${sql.raw(String(SESSION_TIMEOUT_HOURS))} hours'`,
        ),
      ),
    );
    logger.info("Successfully completed session timeout cleanup")
}

export const sessionTimeoutWorker = new Worker(
  "session-timeout",
  processSesssionTimeoutJob,
  { connection: redisConnection },
);
