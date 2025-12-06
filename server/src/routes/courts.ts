import { Router } from "express";
import { authMiddleware, upload } from "../../utils/middleware";
import { handleError } from "../../utils/handleError";
import { db } from "../db";
import { court, courtSession } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import * as z from "zod";
import { MAX_DISTANCE_MI } from "../config/courts";
import { r2 } from "../../utils/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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
  verified: z.coerce.boolean().optional(),
});

courtsRoute.get("/courts", authMiddleware, async (req, res) => {
  try {
    const validQueryParams = CourtsParamsSchema.safeParse(req.query);
    if (!validQueryParams.success) {
      return res.status(400).json({ error: validQueryParams.error.message });
    }

    const { lat, lng, limit, searchQuery, indoor, verified } =
      validQueryParams.data;

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
        image: court.image,
        distance: distanceFormula,
      })
      .from(court)
      .where(sql`${distanceFormula} <= ${MAX_DISTANCE_MI}`)
      .$dynamic();

    if (indoor !== undefined) {
      query = query.where(eq(court.indoor, indoor));
    }
    if (verified !== undefined) {
      query = query.where(eq(court.verified, verified));
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

const PostCourtsBodySchema = z.object({
  name: z.string().min(1),
  indoor: z.coerce.boolean(),
  googlePlaceId: z.string(),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
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
