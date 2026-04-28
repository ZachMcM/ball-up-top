import { PutObjectCommand } from "@aws-sdk/client-s3";
import { and, asc, desc, eq, isNull, lte, or, sql } from "drizzle-orm";
import { Router } from "express";
import * as z from "zod";
import {
  MAX_DISTANCE,
  MAX_DISTANCE_FOR_CHECK_IN,
} from "../config/courts";
import { db } from "../db";
import {
  getCourtActivePlayers,
  getCourtActivityGraph,
  getCourtLeaderboard,
  getCourtSessionStats,
} from "../db/queries/courtQueries";
import {
  court,
  courtSession,
  notificationCourt,
  user,
} from "../db/schema";
import { notificationsQueue } from "../queues/notificationsQueue";
import { getDistanceInMiles } from "../utils/getDistanceMiles";
import { handleError } from "../utils/handleError";
import { invalidateQueries, invalidateQueriesForUser } from "../utils/invalidateQueries";
import { invalidateHomeForCourt } from "../utils/invalidateHomeForCourt";
import { logger } from "../utils/logger";
import { authMiddleware, upload } from "../utils/middleware";
import { r2 } from "../utils/r2";

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

      invalidateQueries(["courts"], ["court", courtId]);
      invalidateQueries(["user", res.locals.userId!]);
      invalidateQueriesForUser(res.locals.userId!, ["home"]);
      await invalidateHomeForCourt(courtId);

      res.json({ success: true });

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

const CourtsParamsSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  limit: z.coerce.number(),
  searchQuery: z.string().optional(),
  indoor: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  verified: z
    .enum(["true"])
    .transform((val) => val === "true")
    .optional(),
  sortBy: z.enum(["distance", "active_players"]).optional().default("distance"),
});

courtsRoute.get("/courts", authMiddleware, async (req, res) => {
  try {
    const validQueryParams = CourtsParamsSchema.safeParse(req.query);
    if (!validQueryParams.success) {
      return res.status(400).json({ error: validQueryParams.error.message });
    }

    const {
      lat,
      lng,
      limit,
      searchQuery,
      indoor,
      sortBy,
    } = validQueryParams.data;

    // Spherical Law of Cosines formula for calculating distance on Earth's surface
    // Returns distance in miles (Earth's radius = 3958.8 miles)
    const distanceFormula = sql<number>`(
      3958.8 * acos(
        cos(radians(${lat})) *
        cos(radians(${court.lat})) *
        cos(radians(${court.lng}) - radians(${lng})) +
        sin(radians(${lat})) *
        sin(radians(${court.lat}))
      )
    )`;

    // Subquery to calculate average players per day at each court
    // Counts unique players per day, then averages across days with activity
    const avgPlayersPerDayStats = db
      .select({
        courtId: sql<number>`court_id`.as("court_id"),
        avgPlayersPerDay: sql<number>`AVG(daily_players)`.as(
          "avg_players_per_day",
        ),
      })
      .from(
        sql`(
          SELECT
            court_id,
            DATE(start_time) as session_date,
            COUNT(DISTINCT user_id)::float as daily_players
          FROM court_session
          GROUP BY court_id, DATE(start_time)
        ) as daily_counts`,
      )
      .groupBy(sql`court_id`)
      .as("avg_players_per_day_stats");

    // Subquery to calculate average player overall rating and current active sessions
    // Only count sessions that started today and have no end time (protection against lingering sessions)
    const sessionStats = db
      .select({
        courtId: courtSession.courtId,
        avgPlayerOverall: sql<number>`
          AVG(CASE WHEN ${courtSession.endTime} IS NULL AND DATE(${courtSession.startTime}) = CURRENT_DATE THEN ${user.overall} END)::float
        `.as("avg_player_overall"),
        currentActiveSessions: sql<number>`
          COUNT(CASE WHEN ${courtSession.endTime} IS NULL AND DATE(${courtSession.startTime}) = CURRENT_DATE THEN 1 END)::integer
        `.as("current_active_sessions"),
      })
      .from(courtSession)
      .innerJoin(user, eq(courtSession.userId, user.id))
      .groupBy(courtSession.courtId)
      .as("session_stats");

    const conditions = [];

    if (!searchQuery) {
      conditions.push(lte(distanceFormula, MAX_DISTANCE));
    }

    if (indoor !== undefined) {
      conditions.push(eq(court.indoor, indoor));
    }

    if (searchQuery) {
      conditions.push(
        sql`(
          ${court.name} ILIKE ${`%${searchQuery}%`} OR
          ${court.address} ILIKE ${`%${searchQuery}%`} OR
          ${sql`array_to_string(${court.aliases}, ' ')`} ILIKE ${`%${searchQuery}%`}
        )`,
      );
    }

    const query = db
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
        distance: distanceFormula,
        avgPlayerOverall: sql<number>`COALESCE(${sessionStats.avgPlayerOverall}, 0)::float`,
        currentActiveSessions: sql<number>`COALESCE(${sessionStats.currentActiveSessions}, 0)::integer`,
      })
      .from(court)
      .leftJoin(
        avgPlayersPerDayStats,
        eq(court.id, avgPlayersPerDayStats.courtId),
      )
      .leftJoin(sessionStats, eq(court.id, sessionStats.courtId))
      .where(and(...conditions))
      .orderBy(
        sortBy === "active_players"
          ? desc(sql`COALESCE(${sessionStats.currentActiveSessions}, 0)`)
          : asc(distanceFormula),
      )
      .limit(limit);

    const courts = await query;

    res.json(courts);
  } catch (error) {
    handleError(error, res, "GET /courts");
  }
});

const PostCourtsBodySchema = z.object({
  name: z.string().min(1),
  indoor: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  googlePlaceId: z.string(),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  address: z.string(),
  aliases: z
    .string()
    .transform((val) => JSON.parse(val))
    .pipe(z.array(z.string()))
    .optional(),
});

courtsRoute.post(
  "/courts/:id/notifications",
  authMiddleware,
  async (req, res) => {
    try {
      const courtId = parseInt(req.params.id);

      if (!Number.isInteger(courtId)) {
        logger.error("Court ID is not an integer.");
        return res.status(400).json({ error: "Court ID is not an integer." });
      }

      await db.insert(notificationCourt).values({
        courtId,
        userId: res.locals.userId!,
      });

      return res.json({ success: true });
    } catch (error) {
      handleError(error, res, "POST /courts/:id/notifications");
    }
  },
);

courtsRoute.delete(
  "/courts/:id/notifications",
  authMiddleware,
  async (req, res) => {
    try {
      const courtId = parseInt(req.params.id);

      if (!Number.isInteger(courtId)) {
        logger.error("Court ID is not an integer.");
        return res.status(400).json({ error: "Court ID is not an integer." });
      }

      await db
        .delete(notificationCourt)
        .where(
          and(
            eq(notificationCourt.courtId, courtId),
            eq(notificationCourt.userId, res.locals.userId!),
          ),
        );

      return res.json({ success: true });
    } catch (error) {
      handleError(error, res, "DELETE /courts/:id/notifications");
    }
  },
);
