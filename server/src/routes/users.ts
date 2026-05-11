import { PutObjectCommand } from "@aws-sdk/client-s3";
import { and, desc, eq, sql } from "drizzle-orm";
import { Router } from "express";
import * as z from "zod";
import { db } from "../db";
import {
  getOverallHistory,
  getRecentSessions,
} from "../db/queries/userQueries";
import { activity, leaderboard, rankChange, rating, user } from "../db/schema";
import { handleError } from "../utils/handleError";
import {
  invalidateQueries,
  invalidateQueriesForUser,
} from "../utils/invalidateQueries";
import { authMiddleware, upload } from "../utils/middleware";
import { r2 } from "../utils/r2";

export const usersRoute = Router();

const PatchPrimaryCollegeSchema = z.object({
  courtId: z.number(),
});

usersRoute.patch("/users/primary-college", authMiddleware, async (req, res) => {
  try {
    const validBody = PatchPrimaryCollegeSchema.safeParse(req.body);
    if (!validBody.success) {
      return res.status(400).json({ error: validBody.error.message });
    }

    const { courtId: primaryCourtId } = validBody.data;


    await db.transaction(async (tx) => {
      await tx
        .update(user)
        .set({
          primaryCourtId,
        })
        .where(eq(user.id, res.locals.userId!));

      const userResult = await tx.query.user.findFirst({
        where: eq(user.id, res.locals.userId!),
        columns: {
          overall: true,
          onboardingStep: true,
        },
      });

      await tx
        .insert(leaderboard)
        .values({
          userId: res.locals.userId!,
          courtId: primaryCourtId,
          rank: null,
          lastRatedAt: null,
        })
        .onConflictDoNothing();

      if (userResult?.onboardingStep !== "complete") {
        await tx.update(user).set({
          onboardingStep: "complete",
        });
      }
    });

    invalidateQueries(["leaderboard", primaryCourtId]);
    invalidateQueriesForUser(res.locals.userId!, ["home"]);

    res.json({ success: true });
  } catch (error) {
    handleError(error, res, "PATCH /users/primary-college");
  }
});

const PatchNameSchema = z.object({
  name: z.string().min(1),
});

usersRoute.patch("/users/name", authMiddleware, async (req, res) => {
  try {
    const validBody = PatchNameSchema.safeParse(req.body);
    if (!validBody.success) {
      return res.status(400).json({ error: validBody.error.message });
    }

    const { name } = validBody.data;

    await db
      .update(user)
      .set({ name, onboardingStep: "height" })
      .where(eq(user.id, res.locals.userId!));

    res.json({ success: true });
  } catch (error) {
    handleError(error, res, "PATCH /users/name");
  }
});

const PatchHeightSchema = z.object({
  height: z.string().min(1),
});

usersRoute.patch("/users/height", authMiddleware, async (req, res) => {
  try {
    const validBody = PatchHeightSchema.safeParse(req.body);
    if (!validBody.success) {
      return res.status(400).json({ error: validBody.error.message });
    }

    const { height } = validBody.data;

    await db
      .update(user)
      .set({ height, onboardingStep: "image" })
      .where(eq(user.id, res.locals.userId!));

    res.json({ success: true });
  } catch (error) {
    handleError(error, res, "PATCH /users/height");
  }
});

usersRoute.get("/users/activity", authMiddleware, async (_, res) => {
  try {
    const activityEntries = await db.query.activity.findMany({
      where: and(
        eq(activity.userId, res.locals.userId!),
        sql`${activity.createdAt} >= NOW() - INTERVAL '30 days'`,
      ),
      orderBy: desc(activity.createdAt),
      with: {
        court: {
          columns: {
            id: true,
            name: true,
            collegeName: true,
            collegeColor: true,
          },
        },
        rating: {
          columns: {
            rateeOldOverall: true,
            rateeNewOverall: true,
          },
          with: {
            rater: {
              columns: {
                name: true,
                image: true,
                overall: true,
                archetype: true,
              },
            },
          },
        },
        rankChange: {
          columns: {
            oldRank: true,
            newRank: true,
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

    const [targetUser] = await db
      .select({
        name: user.name,
        archetype: user.archetype,
        height: user.height,
        overall: user.overall,
        finishingRating: user.finishingRating,
        playmakingRating: user.playmakingRating,
        defenseRating: user.defenseRating,
        shootingRating: user.shootingRating,
        rank: leaderboard.rank,
        overallDelta: sql<number | null>`(
        SELECT ${rating.rateeNewOverall} - COALESCE(${rating.rateeOldOverall}, ${rating.rateeNewOverall})
        FROM ${rating}                                                                                                        
        WHERE ${rating.rateeId} = ${user.id}
        ORDER BY ${rating.createdAt} DESC                                                                                     
        LIMIT 1                                                                                                               
      )`,
        rankDelta: sql<
          number | null
        >`(                                                                                         
        SELECT ${rankChange.newRank} - COALESCE(${rankChange.oldRank}, ${rankChange.newRank})
        FROM ${rankChange}
        WHERE ${rankChange.userId} = ${user.id}
          AND ${rankChange.courtId} = ${user.primaryCourtId}                                                                  
        ORDER BY ${rankChange.createdAt} DESC
        LIMIT 1                                                                                                               
      )`,
      })
      .from(user)
      .innerJoin(
        leaderboard,
        and(
          eq(user.primaryCourtId, leaderboard.courtId),
          eq(user.id, leaderboard.userId),
        ),
      )
      .where(eq(user.id, userId));

    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(targetUser);
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
        }),
      );

      const imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

      const updateOnboardingStep =
        req.body?.onboardingStep === "primaryCollege";

      await db
        .update(user)
        .set({
          image: imageUrl,
          ...(updateOnboardingStep && { onboardingStep: "primaryCollege" }),
        })
        .where(eq(user.id, res.locals.userId!));

      const userLeaderboards = await db
        .select({ courtId: leaderboard.courtId })
        .from(leaderboard)
        .where(eq(leaderboard.userId, res.locals.userId!));

      for (const entry of userLeaderboards) {
        invalidateQueries(["leaderboard", entry.courtId]);
      }

      return res.json({ image: imageUrl });
    } catch (error) {
      handleError(error, res, "PATCH /users/image");
    }
  },
);

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
