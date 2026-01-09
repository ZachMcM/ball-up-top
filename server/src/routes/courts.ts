import { PutObjectCommand } from "@aws-sdk/client-s3";
import { and, asc, desc, eq, isNull, or, sql } from "drizzle-orm";
import { Router } from "express";
import * as z from "zod";
import { getDistanceInMiles } from "../../utils/getDistanceMiles";
import { handleError } from "../../utils/handleError";
import { invalidateQueries } from "../../utils/invalidateQueries";
import { logger } from "../../utils/logger";
import { authMiddleware, upload } from "../../utils/middleware";
import { r2 } from "../../utils/r2";
import {
  MAX_DISTANCE,
  MAX_DISTANCE_FOR_CHECK_IN,
  POPULAR_THRESHOLD,
} from "../config/courts";
import { db } from "../db";
import { court, courtBookmark, courtSession, user } from "../db/schema";

export const courtsRoute = Router();

courtsRoute.post("/courts/:id/bookmark", authMiddleware, async (req, res) => {
  try {
    const courtId = parseInt(req.params.id);

    if (!Number.isInteger(courtId)) {
      logger.error("Court ID is not an integer.");
      return res.status(400).json({ error: "Court ID is not an integer." });
    }

    await db.insert(courtBookmark).values({
      courtId,
      userId: res.locals.userId!,
    });

    return res.json({ success: true });
  } catch (error) {
    handleError(error, res, "POST /courts/:id/bookmark");
  }
});

courtsRoute.delete("/courts/:id/bookmark", authMiddleware, async (req, res) => {
  try {
    const courtId = parseInt(req.params.id);

    if (!Number.isInteger(courtId)) {
      logger.error("Court ID is not an integer.");
      return res.status(400).json({ error: "Court ID is not an integer." });
    }

    await db
      .delete(courtBookmark)
      .where(
        and(
          eq(courtBookmark.courtId, courtId),
          eq(courtBookmark.userId, res.locals.userId!)
        )
      );

    return res.json({ success: true });
  } catch (error) {
    handleError(error, res, "DELETE /courts/:id/bookmark");
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

      const activeUsers = await db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
          height: user.height,
          archetype: user.archetype,
          overall: user.overall,
          finishingRating: user.finishingRating,
          defenseRating: user.defenseRating,
          playmakingRating: user.playmakingRating,
          shootingRating: user.shootingRating,
        })
        .from(courtSession)
        .innerJoin(user, eq(courtSession.userId, user.id))
        .where(
          and(
            eq(courtSession.courtId, courtId),
            isNull(courtSession.endTime),
            sql`DATE(${courtSession.startTime}) = CURRENT_DATE`
          )
        );

      res.json(activeUsers);
    } catch (error) {
      handleError(error, res, "GET /courts/:id/active-players");
    }
  }
);

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
        verified: court.verified,
        image: court.image,
        isBookmarked: sql<boolean>`EXISTS (
          SELECT 1 FROM court_bookmark
          WHERE court_id = ${courtId} AND user_id = ${res.locals.userId}
        )`,
      })
      .from(court)
      .where(eq(court.id, courtId));

    const activityQuery = db.execute<{ hour: number; avgSessions: number }>(sql`
      SELECT
        hours.hour,
        CASE
          WHEN COUNT(cs.id) > 0 THEN
            COUNT(cs.id)::float / GREATEST(COUNT(DISTINCT DATE(cs.start_time AT TIME ZONE 'UTC')), 1)
          ELSE 0
        END as "avgSessions"
      FROM
        generate_series(0, 23) as hours(hour)
        LEFT JOIN court_session cs ON
          cs.court_id = ${courtId} AND
          EXTRACT(HOUR FROM cs.start_time AT TIME ZONE 'UTC')::integer = hours.hour
      GROUP BY hours.hour
      ORDER BY hours.hour
    `);

    const sessionStatsQuery = db
      .select({
        avgPlayerOverall: sql<number>`AVG(${user.overall})::float`,
        currentActiveSessions: sql<number>`COUNT(*)::integer`,
      })
      .from(courtSession)
      .innerJoin(user, eq(courtSession.userId, user.id))
      .where(
        and(
          eq(courtSession.courtId, courtId),
          isNull(courtSession.endTime),
          sql`DATE(${courtSession.startTime}) = CURRENT_DATE`
        )
      );

    // Calculate average players per day: count unique players per day, then average
    const avgPlayersPerDayQuery = db.execute<{ avgPlayersPerDay: number }>(sql`
      SELECT COALESCE(AVG(daily_players), 0) as "avgPlayersPerDay"
      FROM (
        SELECT COUNT(DISTINCT user_id)::float as daily_players
        FROM court_session
        WHERE court_id = ${courtId}
        GROUP BY DATE(start_time)
      ) as daily_counts
    `);

    const leaderboardQuery = db.execute<{
      id: string;
      name: string;
      image: string | null;
      height: number;
      archetype: string;
      overall: number;
      finishingRating: number;
      defenseRating: number;
      playmakingRating: number;
      shootingRating: number;
    }>(sql`
      SELECT * FROM (
        SELECT DISTINCT ON (u.id)
          u.id, u.name, u.image, u.height, u.archetype, u.overall,
          u.finishing_rating as "finishingRating",
          u.defense_rating as "defenseRating",
          u.playmaking_rating as "playmakingRating",
          u.shooting_rating as "shootingRating"
        FROM court_session cs
        INNER JOIN "user" u ON cs.user_id = u.id
        WHERE cs.court_id = ${courtId}
          AND cs.start_time >= NOW() - INTERVAL '30 days'
        ORDER BY u.id
      ) AS unique_users
      ORDER BY overall DESC
      LIMIT 10
    `);

    const activeUsersQuery = db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        height: user.height,
        archetype: user.archetype,
        overall: user.overall,
        finishingRating: user.finishingRating,
        defenseRating: user.defenseRating,
        playmakingRating: user.playmakingRating,
        shootingRating: user.shootingRating,
      })
      .from(courtSession)
      .innerJoin(user, eq(courtSession.userId, user.id))
      .where(
        and(
          eq(courtSession.courtId, courtId),
          isNull(courtSession.endTime),
          sql`DATE(${courtSession.startTime}) = CURRENT_DATE`
        )
      )
      .limit(5);

    const [
      [targetCourt],
      activityResult,
      [sessionStats],
      avgPlayersPerDayResult,
      activeUsers,
      leaderboardResult,
    ] = await Promise.all([
      courtQuery,
      activityQuery,
      sessionStatsQuery,
      avgPlayersPerDayQuery,
      activeUsersQuery,
      leaderboardQuery,
    ]);

    if (!targetCourt) {
      return res.status(404).json({ error: "Court not found" });
    }

    const { lat, lng } = validParams.data;

    return res.json({
      ...targetCourt,
      distance: getDistanceInMiles(targetCourt.lat, targetCourt.lng, lat, lng),
      activityGraph: activityResult.rows,
      avgPlayerOverall: Number(sessionStats?.avgPlayerOverall ?? 0),
      currentActiveSessions: Number(sessionStats?.currentActiveSessions ?? 0),
      popular:
        Number(avgPlayersPerDayResult.rows[0]?.avgPlayersPerDay ?? 0) >
        POPULAR_THRESHOLD,
      currentActiveUsers: activeUsers,
      leaderboard: leaderboardResult.rows,
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
          or(isNull(courtSession.endTime), eq(courtSession.hasRated, false))
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
        lng
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

      invalidateQueries(
        ["court", courtId],
        ["court", courtId, "active-players"]
      );

      res.json({ success: true });
    } catch (error) {
      handleError(error, res, "POST /courts/:courtId/sessions");
    }
  }
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
  popular: z
    .enum(["true"])
    .transform((val) => val === "true")
    .optional(),
  bookmarked: z
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
      verified,
      popular,
      bookmarked,
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
          "avg_players_per_day"
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
        ) as daily_counts`
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

    const conditions = [sql`${distanceFormula} <= ${MAX_DISTANCE}`];

    if (indoor !== undefined) {
      conditions.push(eq(court.indoor, indoor));
    }
    if (verified !== undefined) {
      conditions.push(eq(court.verified, verified));
    }
    if (searchQuery) {
      conditions.push(
        sql`(
          ${court.name} ILIKE ${`%${searchQuery}%`} OR
          ${court.address} ILIKE ${`%${searchQuery}%`} OR
          ${sql`array_to_string(${court.aliases}, ' ')`} ILIKE ${`%${searchQuery}%`}
        )`
      );
    }

    const bookmarkStatus = db
      .select({
        courtId: courtBookmark.courtId,
      })
      .from(courtBookmark)
      .where(eq(courtBookmark.userId, res.locals.userId!))
      .as("bookmark_status");

    if (bookmarked !== undefined) {
      conditions.push(sql`${bookmarkStatus.courtId} IS NOT NULL`);
    }

    if (popular !== undefined) {
      conditions.push(
        sql`COALESCE(${avgPlayersPerDayStats.avgPlayersPerDay}, 0) > ${POPULAR_THRESHOLD}`
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
        verified: court.verified,
        image: court.image,
        distance: distanceFormula,
        popular: sql<boolean>`COALESCE(${avgPlayersPerDayStats.avgPlayersPerDay}, 0) > ${POPULAR_THRESHOLD}`,
        avgPlayerOverall: sql<number>`COALESCE(${sessionStats.avgPlayerOverall}, 0)::float`,
        currentActiveSessions: sql<number>`COALESCE(${sessionStats.currentActiveSessions}, 0)::integer`,
        isBookmarked: sql<boolean>`${bookmarkStatus.courtId} IS NOT NULL`,
      })
      .from(court)
      .leftJoin(
        avgPlayersPerDayStats,
        eq(court.id, avgPlayersPerDayStats.courtId)
      )
      .leftJoin(sessionStats, eq(court.id, sessionStats.courtId))
      .leftJoin(bookmarkStatus, eq(court.id, bookmarkStatus.courtId))
      .where(and(...conditions))
      .orderBy(
        sortBy === "active_players"
          ? desc(sql`COALESCE(${sessionStats.currentActiveSessions}, 0)`)
          : asc(distanceFormula)
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
  "/courts",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          error:
            "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed",
        });
      }

      const validBody = PostCourtsBodySchema.safeParse(req.body);
      if (!validBody.success) {
        return res.status(400).json({ error: validBody.error.message });
      }

      const { name, indoor, googlePlaceId, lat, lng, address, aliases } =
        validBody.data;

      const existingCourt = await db.query.court.findFirst({
        where: eq(court.googlePlaceId, googlePlaceId),
      });

      if (existingCourt) {
        return res
          .status(409)
          .json({ error: "A court with that place already exists" });
      }

      const fileName = `courts/${
        res.locals.userId
      }-${Date.now()}.${file.originalname.split(".").pop()}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      const imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

      await db.insert(court).values({
        name,
        indoor,
        googlePlaceId,
        lat,
        lng,
        address,
        aliases,
        createdByUserId: res.locals.userId,
        image: imageUrl,
      });

      return res.json({ success: true });
    } catch (error) {
      handleError(error, res, "POST /courts");
    }
  }
);
