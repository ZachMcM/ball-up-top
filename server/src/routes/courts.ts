import { and, eq, isNull, or } from "drizzle-orm";
import { Router } from "express";
import * as z from "zod";
import { MAX_DISTANCE_FOR_CHECK_IN } from "../config/courts";
import { db } from "../db";
import { court, courtSession, user } from "../db/schema";
import { notificationsQueue } from "../queues/notificationsQueue";
import { getDistanceInMiles } from "../utils/getDistanceMiles";
import { handleError } from "../utils/handleError";
import { invalidateHomeForCollege } from "../utils/invalidateHomeForCollege";
import {
  invalidateQueries,
  invalidateQueriesForUser,
} from "../utils/invalidateQueries";
import { logger } from "../utils/logger";
import { authMiddleware } from "../utils/middleware";

export const courtsRoute = Router();

courtsRoute.get("/courts/:id", authMiddleware, async (req, res) => {
  try {
    const courtId = parseInt(req.params.id);

    if (!Number.isInteger(courtId)) {
      logger.error("Court ID is not an integer.");
      return res.status(400).json({ error: "Court ID is not an integer." });
    }

    const [targetCourt] = await db
      .select({
        id: court.id,
        name: court.name,
        address: court.address,
        lat: court.lat,
        lng: court.lng,
      })
      .from(court)
      .where(eq(court.id, courtId));

    res.json(targetCourt);
  } catch (error) {
    handleError(error, res, "GET /courts/:id");
  }
});

courtsRoute.get(
  "/courts/:courtId/active-players",
  authMiddleware,
  async (req, res) => {
    try {
      const courtId = parseInt(req.params.courtId);

      if (!Number.isInteger(courtId)) {
        return res.status(400).json({ error: "Court ID is not an integer." });
      }

      const [[targetCourt], activePlayers] = await Promise.all([
        db
          .select({
            id: court.id,
            name: court.name,
            address: court.address,
            lat: court.lat,
            lng: court.lng,
          })
          .from(court)
          .where(eq(court.id, courtId)),
        db
          .select({
            id: user.id,
            name: user.name,
            overall: user.overall,
            archetype: user.archetype,
            image: user.image,
          })
          .from(courtSession)
          .innerJoin(user, eq(courtSession.userId, user.id))
          .where(
            and(
              eq(courtSession.courtId, courtId),
              isNull(courtSession.endTime),
            ),
          ),
      ]);

      if (!targetCourt) {
        return res.status(404).json({ error: "No court was found." });
      }

      res.json({ court: targetCourt, activePlayers });
    } catch (error) {
      handleError(error, res, "GET /courts/:courtId/active-players");
    }
  },
);

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

      console.log(
        "Target:",
        targetCourt.lat,
        targetCourt.lng,
        "Your:",
        lat,
        lng,
      );

      console.log(
        "Distance:",
        distance,
        "MAX_DISTANCE_FOR_CHECKIN",
        MAX_DISTANCE_FOR_CHECK_IN,
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
      invalidateQueries(["court", courtId, "active-players"]);
      invalidateQueries(["user", res.locals.userId!]);
      invalidateQueriesForUser(res.locals.userId!, ["home"]);
      await invalidateHomeForCollege(targetCourt.collegeId);

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
