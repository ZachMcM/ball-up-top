import { PutObjectCommand } from "@aws-sdk/client-s3";
import { and, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { Router } from "express";
import * as z from "zod";
import { handleError } from "../../utils/handleError";
import { authMiddleware, upload } from "../../utils/middleware";
import { r2 } from "../../utils/r2";
import { MAX_OVR, MIN_OVR } from "../config/ratings";
import { db } from "../db";
import { court, courtSession, rating, user } from "../db/schema";

export const usersRoute = Router();

function normalizeRatingHistory(
  ratingHistory: { createdAt: Date; overall: number }[]
) {
  if (ratingHistory.length === 0) return [];

  const overalls = ratingHistory.map(({ overall }) => overall);
  const currMax = Math.max(...overalls);
  const currMin = Math.min(...overalls);

  // Handle case where all values are the same
  if (currMax === currMin) {
    return ratingHistory.map(({ overall, createdAt }) => ({
      createdAt,
      overall: (MIN_OVR + MAX_OVR) / 2,
    }));
  }

  return ratingHistory.map(({ overall: x, createdAt }) => ({
    createdAt,
    overall:
      ((x - currMin) / (currMax - currMin)) * (MAX_OVR - MIN_OVR) + MIN_OVR,
  }));
}

usersRoute.get("/users/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;

    const targetUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
      columns: {
        id: true,
        name: true,
        image: true,
        overall: true,
        finishingRating: true,
        playmakingRating: true,
        defenseRating: true,
        shootingRating: true,
        archetype: true,
        height: true,
      },
    });

    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch rating history (ratings received by this user)
    const ratingHistory = await db
      .select({
        overall: rating.rateeNewOverall,
        createdAt: rating.createdAt,
      })
      .from(rating)
      .where(eq(rating.rateeId, userId))
      .orderBy(rating.createdAt);

    // Fetch recent sessions with court info (limit 5)
    const recentSessions = await db
      .select({
        id: courtSession.id,
        startTime: courtSession.startTime,
        endTime: courtSession.endTime,
        court: {
          id: court.id,
          name: court.name,
          image: court.image,
        },
      })
      .from(courtSession)
      .innerJoin(court, eq(courtSession.courtId, court.id))
      .where(eq(courtSession.userId, userId))
      .orderBy(desc(courtSession.startTime))
      .limit(5);

    const normalizedRatingHistory = normalizeRatingHistory(ratingHistory);

    res.json({
      ...targetUser,
      ratingHistory: normalizedRatingHistory,
      recentSessions,
    });
  } catch (error) {
    handleError(error, res, "GET /users/:id");
  }
});

usersRoute.patch(
  "/users/image",
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

      const fileName = `users/${
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

      await db
        .update(user)
        .set({ image: imageUrl })
        .where(eq(user.id, res.locals.userId!));

      return res.json({ image: imageUrl });
    } catch (error) {
      handleError(error, res, "PATCH /users/image");
    }
  }
);

const PlayersParamsSchema = z.object({
  limit: z.coerce.number().default(25),
  searchQuery: z.string().optional(),
  minHeight: z.string().optional(),
  maxHeight: z.string().optional(),
  minOverall: z.coerce.number().optional(),
  sortBy: z
    .enum(["most_active", "overall_desc", "overall_asc"])
    .optional()
    .default("overall_desc"),
});

usersRoute.get("/users", authMiddleware, async (req, res) => {
  try {
    const validQueryParams = PlayersParamsSchema.safeParse(req.query);
    if (!validQueryParams.success) {
      return res.status(400).json({ error: validQueryParams.error.message });
    }

    const { limit, searchQuery, minHeight, maxHeight, minOverall, sortBy } =
      validQueryParams.data;

    const conditions = [];

    if (searchQuery) {
      conditions.push(ilike(user.name, searchQuery));
    }

    if (minOverall !== undefined) {
      conditions.push(gte(user.overall, minOverall));
    }

    if (minHeight !== undefined) {
      conditions.push(gte(user.height, minHeight));
    }
    if (maxHeight !== undefined) {
      conditions.push(lte(user.height, maxHeight));
    }

    const query = db
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
      .from(user)
      .leftJoin(courtSession, sql`${courtSession.userId} = ${user.id}`)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(
        user.id,
        user.name,
        user.image,
        user.height,
        user.archetype,
        user.overall
      );

    if (sortBy === "most_active") {
      query.orderBy(sql`sessions_count_30_days DESC`);
    } else if (sortBy === "overall_desc") {
      query.orderBy(sql`${user.overall} DESC`);
    } else if (sortBy === "overall_asc") {
      query.orderBy(sql`${user.overall} ASC`);
    }

    const players = await query.limit(limit);

    res.json(players);
  } catch (error) {
    handleError(error, res, "GET /players");
  }
});
