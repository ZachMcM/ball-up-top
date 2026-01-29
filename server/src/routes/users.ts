import { PutObjectCommand } from "@aws-sdk/client-s3";
import {
  and,
  desc,
  eq,
  gte,
  ilike,
  InferSelectModel,
  lte,
  sql,
} from "drizzle-orm";
import { Router } from "express";
import * as z from "zod";
import { handleError } from "../../utils/handleError";
import { authMiddleware, upload } from "../../utils/middleware";
import { r2 } from "../../utils/r2";
import { db } from "../db";
import { activity, court, courtSession, rating, user } from "../db/schema";
import { invalidateQueries } from "../../utils/invalidateQueries";

export const usersRoute = Router();

usersRoute.get("/users/activity", authMiddleware, async (_, res) => {
  try {
    const activityEntries = await db.query.activity.findMany({
      where: and(
        eq(activity.userId, res.locals.userId!),
        sql`${activity.createdAt} >= NOW() - INTERVAL '30 days'`
      ),
      orderBy: desc(activity.createdAt),
      with: {
        court: true,
        courtSession: {
          with: {
            court: true,
          },
        },
        rating: {
          with: {
            rater: {
              columns: {
                id: true,
                name: true,
                image: true,
                overall: true,
                archetype: true,
                height: true,
                shootingRating: true,
                finishingRating: true,
                defenseRating: true,
                playmakingRating: true,
              },
            },
          },
        },
      },
    });

    res.json(activityEntries);
  } catch (error) {
    handleError(error, res, "GET /users/activity");
  }
});

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

    const ratingHistory = await db
      .select({
        overall: rating.rateeNewOverall,
        createdAt: rating.createdAt,
      })
      .from(rating)
      .where(eq(rating.rateeId, userId))
      .orderBy(rating.createdAt)
      .limit(25);

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

    res.json({
      ...targetUser,
      ratingHistory,
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

    const sessionsCount30Days = sql<number>`COUNT(CASE WHEN ${courtSession.startTime} >= NOW() - INTERVAL '30 days' THEN 1 END)`.as('sessions_count_30_days');

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
        sessionsCount30Days,
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
      query.orderBy(sql`${sessionsCount30Days} DESC`);
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

const ExpoPushTokenSchema = z.object({
  expoPushToken: z.string(),
});

usersRoute.patch("/users/expoPushToken", authMiddleware, async (req, res) => {
  try {
    const validBody = ExpoPushTokenSchema.safeParse(req.body);
    if (!validBody.success) {
      return res.status(400).json({ error: validBody.error.message });
    }

    await db
      .update(user)
      .set({ expoPushToken: validBody.data.expoPushToken })
      .where(eq(user.id, res.locals.userId!));

    return res.json({ success: true });
  } catch (error) {
    handleError(error, res, "PATCH /users/expoPushToken");
  }
});

usersRoute.patch("/users/activity/read", authMiddleware, async (req, res) => {
  try {
    await db
      .update(activity)
      .set({ read: true })
      .where(eq(activity.userId, res.locals.userId!));

    invalidateQueries(["activity"]);

    return res.json({ success: true });
  } catch (error) {
    handleError(error, res, "PATCH /users/activity/read");
  }
});
