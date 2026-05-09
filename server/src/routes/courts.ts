import { and, asc, eq, isNull, or, sql } from "drizzle-orm";
import { Router } from "express";
import * as z from "zod";
import { MAX_DISTANCE_FOR_CHECK_IN } from "../config/courts";
import { db } from "../db";
import {
  getCourtActivePlayers,
  getCourtActivityGraph,
  getCourtLeaderboard,
  getCourtSessionStats,
} from "../db/queries/courtQueries";
import { court, courtSession } from "../db/schema";
import { notificationsQueue } from "../queues/notificationsQueue";
import { getDistanceInMiles } from "../utils/getDistanceMiles";
import { handleError } from "../utils/handleError";
import { invalidateHomeForCourt } from "../utils/invalidateHomeForCourt";
import {
  invalidateQueries,
  invalidateQueriesForUser,
} from "../utils/invalidateQueries";
import { logger } from "../utils/logger";
import { authMiddleware } from "../utils/middleware";

export const courtsRoute = Router();

courtsRoute.get("/colleges", authMiddleware, async (_, res) => {
  try {
    const colleges = await db
      .select({
        courtId: court.id,
        collegeName: court.collegeName,
        collegeColor: court.collegeColor,
      })
      .from(court)
      .orderBy(asc(court.collegeName), asc(court.name));

    res.json(colleges);
  } catch (error) {
    handleError(error, res, "GET /colleges");
  }
});

courtsRoute.get(
  "/courts/:id/active-players",
  authMiddleware,
  async (req, res) => {
    try {
      const courtId = parseInt(req.params.id);

      if (!Number.isInteger(courtId)) {
        logger.error("Court ID is not an integer.");
        return res.status(400).json({ error: "Court ID is not an integer." });
      }

      const activeUsers = await getCourtActivePlayers({ courtId });

      res.json(activeUsers);
    } catch (error) {
      handleError(error, res, "GET /courts/:id/active-players");
    }
  },
);

courtsRoute.get("/courts/:id/leaderboard", authMiddleware, async (req, res) => {
  try {
    const courtId = parseInt(req.params.id);

    if (!Number.isInteger(courtId)) {
      logger.error("Court ID is not an integer.");
      return res.status(400).json({ error: "Court ID is not an integer." });
    }

    const { top } = await getCourtLeaderboard({ courtId, limit: 50 });

    res.json(top);
  } catch (error) {
    handleError(error, res, "GET /courts/:id/leaderboard");
  }
});

const CourtGetSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

courtsRoute.get("/courts/:id", authMiddleware, async (req, res) => {
  try {
    const courtId = parseInt(req.params.id);

    if (!Number.isInteger(courtId)) {
      logger.error("Court ID is not an integer.");
      return res.status(400).json({ error: "Court ID is not an integer." });
    }

    const validParams = CourtGetSchema.safeParse(req.query);
    if (validParams.error) {
      logger.error(validParams.error.message);
      return res.status(400).json({ error: validParams.error.message });
    }

    const courtQuery = db
      .select({
        id: court.id,
        name: court.name,
        address: court.address,
        lat: court.lat,
        lng: court.lng,
        indoor: court.indoor,
        image: court.image,
        collegeName: court.collegeName,
        collegeColor: court.collegeColor,
        isNotificationEnabled: sql<boolean>`EXISTS (
          SELECT 1 FROM notification_court
          WHERE court_id = ${courtId} AND user_id = ${res.locals.userId}
        )`,
      })
      .from(court)
      .where(eq(court.id, courtId));

    const [
      [targetCourt],
      activityGraph,
      sessionStats,
      activeUsers,
      leaderboard,
    ] = await Promise.all([
      courtQuery,
      getCourtActivityGraph({ courtId }),
      getCourtSessionStats({ courtId }),
      getCourtActivePlayers({ courtId, limit: 5 }),
      getCourtLeaderboard({
        courtId,
        limit: 5,
        currentUserId: res.locals.userId,
      }),
    ]);

    if (!targetCourt) {
      return res.status(404).json({ error: "Court not found" });
    }

    const { lat, lng } = validParams.data;

    return res.json({
      ...targetCourt,
      distance: getDistanceInMiles(targetCourt.lat, targetCourt.lng, lat, lng),
      activityGraph,
      avgPlayerOverall: sessionStats.avgPlayerOverall,
      currentActiveSessions: sessionStats.currentActiveSessions,
      currentActiveUsers: activeUsers,
      leaderboard,
    });
  } catch (error) {
    handleError(error, res, "GET /courts/:courtId");
  }
});

const CourtSessionPostBodySchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

courtsRoute.post(
  "/courts/:courtId/sessions",
  authMiddleware,
  async (req, res) => {
    try {
      const courtId = parseInt(req.params.courtId);

      if (!Number.isInteger(courtId)) {
        return res.status(400).json({ error: "Court ID is not an integer." });
      }

      const validBody = CourtSessionPostBodySchema.safeParse(req.body);
      if (validBody.error) {
        return res.status(400).json({ error: validBody.error.message });
      }

      const { lat, lng } = validBody.data;

      const targetCourt = await db.query.court.findFirst({
        where: eq(court.id, courtId),
      });

      if (!targetCourt) {
        return res.status(404).json({ error: "No court was found" });
      }

      const preexistingSession = await db.query.courtSession.findFirst({
        where: and(
          eq(courtSession.userId, res.locals.userId!),
          or(isNull(courtSession.endTime), eq(courtSession.hasRated, false)),
        ),
      });

      if (preexistingSession) {
        return res.status(409).json({
          error:
            "You already have an active session. Please checkout first or finish rating.",
        });
      }

      const distance = getDistanceInMiles(
        targetCourt.lat,
        targetCourt.lng,
        lat,
        lng,
      );

      if (distance > MAX_DISTANCE_FOR_CHECK_IN) {
        return res.status(400).json({
          error: "You must be at the court to check in.",
          distance: Math.round(distance),
        });
      }

      await db.insert(courtSession).values({
        userId: res.locals.userId!,
        courtId,
      });

      res.json({ success: true });

      invalidateQueries(["courts"], ["court", courtId]);
      invalidateQueries(["user", res.locals.userId!]);
      invalidateQueriesForUser(res.locals.userId!, ["home"]);
      await invalidateHomeForCourt(courtId);

      // Queue court threshold check for notifications
      notificationsQueue.add("court_threshold_check", {
        type: "court_threshold_check",
        courtId,
        checkingInUserId: res.locals.userId!,
      });
    } catch (error) {
      handleError(error, res, "POST /courts/:courtId/sessions");
    }
  },
);