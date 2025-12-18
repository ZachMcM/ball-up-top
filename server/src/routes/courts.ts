import { PutObjectCommand } from "@aws-sdk/client-s3";
import { and, eq, isNull, sql } from "drizzle-orm";
import { Router } from "express";
import * as z from "zod";
import { handleError } from "../../utils/handleError";
import { authMiddleware, upload } from "../../utils/middleware";
import { r2 } from "../../utils/r2";
import { MAX_DISTANCE_FOR_CHECK_IN, MAX_DISTANCE } from "../config/courts";
import { db } from "../db";
import { court, courtSession, user } from "../db/schema";
import { getDistanceInMiles } from "../../utils/getDistanceMiles";

export const courtsRoute = Router();

const CourtGetSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

courtsRoute.get("/courts/:courtId", authMiddleware, async (req, res) => {
  try {
    const courtId = parseInt(req.params.courtId);

    if (!Number.isInteger(courtId)) {
      return res.status(400).json({ error: "Court ID is not an integer." });
    }

    const validParams = CourtGetSchema.safeParse(req.params);
    if (validParams.error) {
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
      })
      .from(court)
      .where(eq(court.id, courtId));

    const activityQuery = db.execute<{ hour: number; avgSessions: number }>(sql`
      SELECT
        hours.hour,
        CASE
          WHEN COUNT(cs.id) > 0 THEN
            COUNT(cs.id)::float / GREATEST(COUNT(DISTINCT DATE(cs.start_time)), 1)
          ELSE 0
        END as "avgSessions"
      FROM
        generate_series(0, 23) as hours(hour)
        LEFT JOIN court_session cs ON
          cs.court_id = ${courtId} AND
          EXTRACT(HOUR FROM cs.start_time)::integer = hours.hour
      GROUP BY hours.hour
      ORDER BY hours.hour
    `);

    const sessionStatsQuery = db
      .select({
        avgPlayerOverall: sql<number>`AVG(${user.overall})`,
        currentActiveSessions: sql<number>`COUNT(*)`,
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
      );

    const [[targetCourt], activityResult, [sessionStats], activeUsers] =
      await Promise.all([
        courtQuery,
        activityQuery,
        sessionStatsQuery,
        activeUsersQuery,
      ]);

    if (!targetCourt) {
      return res.status(404).json({ error: "Court not found" });
    }

    const { lat, lng } = validParams.data;

    return res.json({
      ...targetCourt,
      distance: getDistanceInMiles(targetCourt.lat, targetCourt.lng, lat, lng),
      activityGraph: activityResult.rows,
      avgPlayerOverall: sessionStats?.avgPlayerOverall ?? 0,
      currentActiveSessions: sessionStats?.currentActiveSessions ?? 0,
      currentActiveUsers: activeUsers,
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
          eq(courtSession.courtId, courtId),
          isNull(courtSession.endTime),
          eq(courtSession.userId, res.locals.userId!)
        ),
      });

      if (preexistingSession) {
        return res.status(409).json({
          error: "You already have an active session. Please checkout first.",
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
          error: "You must be at the court to check in",
          distance: Math.round(distance),
        });
      }

      await db.insert(courtSession).values({
        userId: res.locals.userId!,
        courtId,
      });

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
    .string()
    .transform((val) => val === "true")
    .optional(),
  verified: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

courtsRoute.get("/courts", authMiddleware, async (req, res) => {
  try {
    const validQueryParams = CourtsParamsSchema.safeParse(req.query);
    if (!validQueryParams.success) {
      return res.status(400).json({ error: validQueryParams.error.message });
    }

    const { lat, lng, limit, searchQuery, indoor, verified } =
      validQueryParams.data;

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

    // Subquery to calculate average sessions per hour of day (all 24 hours represented)
    const activityByHour = db
      .select({
        courtId: sql<number>`court_id`.as("court_id"),
        activityData: sql<string>`json_agg(
          json_build_object(
            'hour', hour,
            'avgSessions', COALESCE(avg_count, 0)
          )
          ORDER BY hour
        )`.as("activity_data"),
      })
      .from(
        sql`
        (
          SELECT
            c.id as court_id,
            hours.hour,
            CASE
              WHEN COUNT(cs.id) > 0 THEN
                COUNT(cs.id)::float / COUNT(DISTINCT DATE(cs.start_time))
              ELSE 0
            END as avg_count
          FROM
            court c
            CROSS JOIN generate_series(0, 23) as hours(hour)
            LEFT JOIN court_session cs ON
              cs.court_id = c.id AND
              EXTRACT(HOUR FROM cs.start_time)::integer = hours.hour
          GROUP BY c.id, hours.hour
        ) as hourly_data
      `
      )
      .groupBy(sql`court_id`)
      .as("activity_by_hour");

    // Subquery to calculate average player overall rating and current active sessions
    // Only count sessions that started today and have no end time (protection against lingering sessions)
    const sessionStats = db
      .select({
        courtId: courtSession.courtId,
        avgPlayerOverall: sql<number>`
          AVG(CASE WHEN ${courtSession.endTime} IS NULL AND DATE(${courtSession.startTime}) = CURRENT_DATE THEN ${user.overall} END)
        `.as("avg_player_overall"),
        currentActiveSessions: sql<number>`
          COUNT(CASE WHEN ${courtSession.endTime} IS NULL AND DATE(${courtSession.startTime}) = CURRENT_DATE THEN 1 END)
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
        activityGraph: activityByHour.activityData,
        avgPlayerOverall: sql<number>`COALESCE(${sessionStats.avgPlayerOverall}, 0)`,
        currentActiveSessions: sql<number>`COALESCE(${sessionStats.currentActiveSessions}, 0)`,
      })
      .from(court)
      .leftJoin(activityByHour, eq(court.id, activityByHour.courtId))
      .leftJoin(sessionStats, eq(court.id, sessionStats.courtId))
      .where(and(...conditions));

    const courts = await query.orderBy(distanceFormula).limit(limit);

    res.json(courts);
  } catch (error) {
    handleError(error, res, "GET /courts");
  }
});

courtsRoute.get("/courts/:id", authMiddleware, async (req, res) => {
  try {
    const courtId = req.params.id;
    if (!Number.isInteger(courtId)) {
      return res.status(400).json({ error: "Invalid court id." });
    }
  } catch (error) {
    handleError(error, res, "GET /courts/:id");
  }
});

const PostCourtsBodySchema = z.object({
  name: z.string().min(1),
  indoor: z
    .string()
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
