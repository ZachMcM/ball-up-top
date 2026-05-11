import { and, asc, desc, eq, isNotNull, isNull, or, sql } from "drizzle-orm";
import { Router } from "express";
import * as z from "zod";
import { MAX_DISTANCE_FOR_CHECK_IN } from "../config/courts";
import { db } from "../db";
import {
  court,
  courtSession,
  leaderboard,
  rankChange,
  user,
} from "../db/schema";
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

courtsRoute.get("/courts/:id/players", authMiddleware, async (req, res) => {
  try {
    const courtId = parseInt(req.params.id);

    if (!Number.isInteger(courtId)) {
      logger.error("Court ID is not an integer.");
      return res.status(400).json({ error: "Court ID is not an integer." });
    }

    const courtPlayers = await db
      .select({
        rank: leaderboard.rank,
        overall: user.overall,
        userId: user.id,
        name: user.name,
        image: user.image,
        archetype: user.archetype,
      })
      .from(leaderboard)
      .innerJoin(user, eq(leaderboard.userId, user.id))
      .where(eq(leaderboard.courtId, courtId));

    res.json(courtPlayers);
  } catch (error) {
    handleError(error, res, "GET /courts/:id/players");
  }
});

courtsRoute.get("/courts/:id/leaderboard", authMiddleware, async (req, res) => {
  try {
    const courtId = parseInt(req.params.id);

    if (!Number.isInteger(courtId)) {
      logger.error("Court ID is not an integer.");
      return res.status(400).json({ error: "Court ID is not an integer." });
    }

    const [orderedCourtLeaderboard, topMovers] = await Promise.all([
      db
        .select({
          rank: leaderboard.rank,
          overall: user.overall,
          userId: user.id,
          name: user.name,
          image: user.image,
          archetype: user.archetype,
        })
        .from(leaderboard)
        .innerJoin(user, eq(leaderboard.userId, user.id))
        .where(
          and(eq(leaderboard.courtId, courtId), isNotNull(leaderboard.rank)),
        )
        .orderBy(asc(leaderboard.rank)),
      db
        .selectDistinctOn([rankChange.userId], {
          oldRank: rankChange.oldRank,
          rank: rankChange.newRank,
          userId: rankChange.userId,
          name: user.name,
          image: user.image,
          archetype: user.archetype,
          rankImprovement:
            sql<number>`(${rankChange.oldRank} - ${rankChange.newRank})`.as(
              "rank_improvement",
            ),
        })
        .from(rankChange)
        .innerJoin(user, eq(rankChange.userId, user.id))
        .where(
          and(
            eq(rankChange.courtId, courtId),
            isNotNull(rankChange.oldRank),
          ),
        )
        .orderBy(rankChange.userId, desc(rankChange.createdAt))
        .then((rows) =>
          rows
            .filter((r) => r.rankImprovement > 0)
            .sort((a, b) => b.rankImprovement - a.rankImprovement)
            .slice(0, 3),
        ),
    ]);

    res.json({ orderedUsers: orderedCourtLeaderboard, topMovers });
  } catch (error) {
    handleError(error, res, "GET /courts/:id/leaderboard");
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
