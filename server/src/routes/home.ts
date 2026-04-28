import { eq } from "drizzle-orm";
import { Router } from "express";
import * as z from "zod";
import { db } from "../db";
import {
  getCourtActivePlayers,
  getCourtLeaderboard,
  getCourtSessionStats,
} from "../db/queries/courtQueries";
import {
  getOverallHistory,
  getRecentSessions,
} from "../db/queries/userQueries";
import { court, user } from "../db/schema";
import { getDistanceInMiles } from "../utils/getDistanceMiles";
import { handleError } from "../utils/handleError";
import { authMiddleware } from "../utils/middleware";

export const homeRoute = Router();

const HomeGetSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

homeRoute.get("/home", authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.userId!;

    const validParams = HomeGetSchema.safeParse(req.query);
    if (validParams.error) {
      return res.status(400).json({ error: validParams.error.message });
    }
    const { lat, lng } = validParams.data;

    const targetUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
      columns: {
        id: true,
        name: true,
        image: true,
        overall: true,
        height: true,
        archetype: true,
        primaryCourtId: true,
      },
    });

    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const [overallHistory, recentSessions] = await Promise.all([
      getOverallHistory({ userId }),
      getRecentSessions({ userId, limit: 1 }),
    ]);

    const recentSession = recentSessions[0] ?? null;

    let primaryCourt = null;
    if (targetUser.primaryCourtId !== null) {
      const courtId = targetUser.primaryCourtId;

      const [
        [targetCourt],
        sessionStats,
        currentActiveUsers,
        leaderboard,
      ] = await Promise.all([
        db
          .select({
            id: court.id,
            name: court.name,
            image: court.image,
            indoor: court.indoor,
            address: court.address,
            lat: court.lat,
            lng: court.lng,
            collegeName: court.collegeName,
            collegeColor: court.collegeColor,
          })
          .from(court)
          .where(eq(court.id, courtId)),
        getCourtSessionStats({ courtId }),
        getCourtActivePlayers({ courtId, limit: 5 }),
        getCourtLeaderboard({ courtId, limit: 5, currentUserId: userId }),
      ]);

      if (targetCourt) {
        const { lat: courtLat, lng: courtLng, ...courtRest } = targetCourt;
        primaryCourt = {
          ...courtRest,
          distance: getDistanceInMiles(courtLat, courtLng, lat, lng),
          currentActiveSessions: sessionStats.currentActiveSessions,
          currentActiveUsers,
          leaderboard,
        };
      }
    }

    const { primaryCourtId: _primaryCourtId, ...userResponse } = targetUser;

    res.json({
      user: userResponse,
      overallHistory,
      recentSession,
      primaryCourt,
    });
  } catch (error) {
    handleError(error, res, "GET /home");
  }
});
