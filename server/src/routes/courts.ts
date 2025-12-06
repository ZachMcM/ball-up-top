import { Router } from "express";
import { authMiddleware } from "../../utils/middleware";
import { handleError } from "../../utils/handleError";
import { db } from "../db";
import { court, courtSession } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import * as z from "zod";
import { MAX_DISTANCE_MI } from "../config/courts";

export const courtsRoute = Router();

courtsRoute.post(
  "/courts/:courtId/sessions",
  authMiddleware,
  async (req, res) => {
    try {
      const courtId = parseInt(req.params.courtId);

      if (!Number.isInteger(courtId)) {
        return res.status(400).json({ error: "Court ID is not an integer." });
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
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  limit: z.coerce.number(),
  searchQuery: z.string().optional(),
  indoor: z.coerce.boolean().optional(),
  verified: z.coerce.boolean().optional()
});

courtsRoute.get("/courts", authMiddleware, async (req, res) => {
  try {
    const validQueryParams = CourtsParamsSchema.safeParse(req.query);
    if (!validQueryParams.success) {
      return res.status(400).json({ error: validQueryParams.error.message });
    }

    const { lat, lng, limit, searchQuery, indoor, verified } = validQueryParams.data;

    // Haversine formula for calculating distance on Earth's surface
    // Returns distance in miles
    const distanceFormula = sql<number>`(
      3959 * acos(
        cos(radians(${lat})) *
        cos(radians(${court.lat})) *
        cos(radians(${court.lng}) - radians(${lng})) +
        sin(radians(${lat})) *
        sin(radians(${court.lat}))
      )
    )`;

    let query = db
      .select({
        id: court.id,
        name: court.name,
        address: court.address,
        lat: court.lat,
        lng: court.lng,
        indoor: court.indoor,
        verified: court.verified,
        photoUrl: court.photoUrl,
        distance: distanceFormula,
      })
      .from(court)
      .where(sql`${distanceFormula} <= ${MAX_DISTANCE_MI}`)
      .$dynamic();

    // Apply optional filters
    if (indoor !== undefined) {
      query = query.where(eq(court.indoor, indoor));
    }
    if (verified !== undefined) {
      query = query.where(eq(court.verified, verified))
    }

    if (searchQuery) {
      query = query.where(
        sql`(
          ${court.name} ILIKE ${`%${searchQuery}%`} OR
          ${court.address} ILIKE ${`%${searchQuery}%`} OR
          ${sql`array_to_string(${court.aliases}, ' ')`} ILIKE ${`%${searchQuery}%`}
        )`
      );
    }

    const courts = await query.orderBy(distanceFormula).limit(limit);

    res.json(courts);
  } catch (error) {
    handleError(error, res, "GET /courts");
  }
});
