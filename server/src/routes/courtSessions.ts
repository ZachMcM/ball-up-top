import {
  and,
  asc,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  or,
  sql,
} from "drizzle-orm";
import { Router } from "express";
import { db } from "../db";
import {
  court,
  courtSession,
  encounteredPlayer,
  leaderboard,
  rankChange,
  rating,
  user,
} from "../db/schema";
import { handleError } from "../utils/handleError";
import { authMiddleware } from "../utils/middleware";

import * as z from "zod";
import { redis } from "../utils/redis";
import {
  MAX_OVR,
  MAX_SHIFT,
  MIN_LIFETIME_CT,
  MIN_OVR,
  OVERLAP_DIFF_THRESH_1,
  OVERLAP_DIFF_THRESH_2,
  OVERLAP_DIFF_THRESH_2_WT,
} from "../config/ratings";
import { notificationsQueue } from "../queues/notificationsQueue";
import { sessionRatingReminderQueue } from "../queues/sessionRatingReminderQueue";
import {
  createEncounteredPlayersForSession,
  getEncounteredPlayers,
} from "../utils/checkoutSession";
import { clamp } from "../utils/clamp";
import { generateArchetype } from "../utils/generateArchetype";
import { invalidateHomeForCollege } from "../utils/invalidateHomeForCollege";
import {
  invalidateQueries,
  invalidateQueriesForUser,
} from "../utils/invalidateQueries";
import { logger } from "../utils/logger";

export const courtSessionsRoute = Router();

const CourtSessionsGetSchema = z.object({
  hasRated: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
});

courtSessionsRoute.get("/court-sessions", authMiddleware, async (req, res) => {
  try {
    const validQueryParams = CourtSessionsGetSchema.safeParse(req.query);
    if (validQueryParams.error) {
      logger.error(validQueryParams.error.message);
      return res.status(400).json({ error: validQueryParams.error.message });
    }

    const { hasRated, isActive } = validQueryParams.data;

    const existingCourtSession = await db.query.courtSession.findFirst({
      where: and(
        eq(courtSession.userId, res.locals.userId!),
        isActive !== undefined
          ? isActive
            ? isNull(courtSession.endTime)
            : isNotNull(courtSession.endTime)
          : undefined,
        hasRated !== undefined
          ? eq(courtSession.hasRated, hasRated)
          : undefined,
      ),
    });

    return res.json(existingCourtSession);
  } catch (error) {
    handleError(error, res, "GET /court-sessions");
  }
});

function computeOutlierWeight(
  newRaw: number,
  oldRaw: number,
  lifetimeCount: number,
) {
  if (lifetimeCount < MIN_LIFETIME_CT) {
    return 1.0;
  }

  const diff = Math.abs(newRaw - oldRaw);

  if (diff > OVERLAP_DIFF_THRESH_1) return 0.0;
  if (diff > OVERLAP_DIFF_THRESH_2) return OVERLAP_DIFF_THRESH_2_WT;
  return 1.0;
}

function applyEMA(oldRaw: number, newRaw: number, weight: number) {
  const w = clamp(0, 1, weight);

  const EMA = oldRaw * (1 - w) + newRaw * w;

  const delta = EMA - oldRaw;

  let updated = EMA;

  if (delta > MAX_SHIFT) updated = oldRaw + MAX_SHIFT;
  if (delta < -MAX_SHIFT) updated = oldRaw - MAX_SHIFT;

  return clamp(MIN_OVR, MAX_OVR, updated);
}

courtSessionsRoute.get(
  "/court-sessions/:sessionId/players",
  authMiddleware,
  async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);

      if (!Number.isInteger(sessionId)) {
        return res.status(400).json({ error: "Session ID is not an integer." });
      }

      const targetCourtSession = await db.query.courtSession.findFirst({
        where: eq(courtSession.id, sessionId),
      });

      if (!targetCourtSession) {
        return res.status(404).json({ error: "No court session found." });
      }

      if (!targetCourtSession.endTime) {
        return res
          .status(400)
          .json({ error: "Session is still active, check out first." });
      }

      if (targetCourtSession.userId !== res.locals.userId) {
        return res
          .status(401)
          .json({ error: "Unauthorized for this court session." });
      }

      const encounteredPlayers =
        await getEncounteredPlayers(targetCourtSession);

      return res.json(encounteredPlayers.map((ep) => ep.user));
    } catch (error) {
      handleError(error, res, "GET /court-sessions/:sessionId/players");
    }
  },
);

courtSessionsRoute.get(
  "/court-sessions/:sessionId/encountered-players",
  authMiddleware,
  async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);

      if (!Number.isInteger(sessionId)) {
        return res.status(400).json({ error: "Session ID is not an integer." });
      }

      const targetCourtSession = await db.query.courtSession.findFirst({
        where: eq(courtSession.id, sessionId),
      });

      if (!targetCourtSession) {
        return res.status(404).json({ error: "No court session found." });
      }

      if (targetCourtSession.userId !== res.locals.userId) {
        return res
          .status(401)
          .json({ error: "Unauthorized for this court session." });
      }

      const encounteredPlayersData = await db.query.encounteredPlayer.findMany({
        where: eq(encounteredPlayer.courtSessionId, sessionId),
        orderBy: (ep, { asc }) => [asc(ep.displayOrder)],
      });

      return res.json(encounteredPlayersData);
    } catch (error) {
      handleError(
        error,
        res,
        "GET /court-sessions/:sessionId/encountered-players",
      );
    }
  },
);

const EncounteredPlayerPatchSchema = z.object({
  defenseRating: z.number().int().min(MIN_OVR).max(MAX_OVR).optional(),
  finishingRating: z.number().int().min(MIN_OVR).max(MAX_OVR).optional(),
  shootingRating: z.number().int().min(MIN_OVR).max(MAX_OVR).optional(),
  playmakingRating: z.number().int().min(MIN_OVR).max(MAX_OVR).optional(),
  skipped: z.boolean().optional(),
});

courtSessionsRoute.patch(
  "/encountered-players/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      if (!Number.isInteger(id)) {
        return res
          .status(400)
          .json({ error: "Encountered player ID is not an integer." });
      }

      const validBody = EncounteredPlayerPatchSchema.safeParse(req.body);
      if (!validBody.success) {
        return res.status(400).json({ error: validBody.error.message });
      }

      // Fetch the encountered player with its court session
      const ep = await db.query.encounteredPlayer.findFirst({
        where: eq(encounteredPlayer.id, id),
        with: {
          courtSession: true,
        },
      });

      if (!ep) {
        return res.status(404).json({ error: "Encountered player not found." });
      }

      // Verify the user owns this court session
      if (ep.courtSession.userId !== res.locals.userId) {
        return res
          .status(401)
          .json({ error: "Unauthorized for this encountered player." });
      }

      // If session is already rated, ignore the draft update (no-op)
      if (ep.courtSession.hasRated) {
        return res.json({ success: true });
      }

      const {
        defenseRating,
        finishingRating,
        shootingRating,
        playmakingRating,
        skipped,
      } = validBody.data;

      await db
        .update(encounteredPlayer)
        .set({
          ...(defenseRating !== undefined && { defenseRating }),
          ...(finishingRating !== undefined && { finishingRating }),
          ...(shootingRating !== undefined && { shootingRating }),
          ...(playmakingRating !== undefined && { playmakingRating }),
          ...(skipped !== undefined && { skipped }),
        })
        .where(eq(encounteredPlayer.id, id));

      return res.json({ success: true });
    } catch (error) {
      handleError(error, res, "PATCH /encountered-players/:id");
    }
  },
);

courtSessionsRoute.post(
  "/court-sessions/:sessionId/ratings",
  authMiddleware,
  async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);

      if (!Number.isInteger(sessionId)) {
        return res.status(400).json({ error: "Session ID is not an integer." });
      }

      const targetCourtSession = await db.query.courtSession.findFirst({
        where: eq(courtSession.id, sessionId),
      });

      if (!targetCourtSession) {
        return res.status(404).json({ error: "No court session found." });
      }

      if (!targetCourtSession.endTime) {
        return res
          .status(400)
          .json({ error: "Session is still active, check out first." });
      }

      if (targetCourtSession.userId !== res.locals.userId) {
        return res
          .status(401)
          .json({ error: "Unauthorized for this court session." });
      }

      if (targetCourtSession.hasRated) {
        return res
          .status(400)
          .json({ error: "Session has already been rated." });
      }

      // Fetch all encountered players for this session
      const encounteredPlayersData = await db.query.encounteredPlayer.findMany({
        where: eq(encounteredPlayer.courtSessionId, sessionId),
      });

      if (encounteredPlayersData.length === 0) {
        return res.status(400).json({
          error: "No encountered players found for this session.",
        });
      }

      const sessionCourt = await db.query.court.findFirst({
        where: eq(court.id, targetCourtSession.courtId),
        columns: { id: true, collegeId: true },
      });

      if (!sessionCourt) {
        return res
          .status(404)
          .json({ error: "Court for this session no longer exists." });
      }

      const sessionCollegeId = sessionCourt.collegeId;

      const { ratingIds, rankChangeIds, rateeIds } = await db.transaction(
        async (tx) => {
          const collegeId = sessionCollegeId;
          const createdRatingIds: number[] = [];
          const createdRankChangeIds: number[] = [];
          const ratedUserIds: string[] = [];

          // Phase 1: Get potential ratee IDs and snapshot old ranks
          const potentialRateeIds = encounteredPlayersData
            .filter(
              (ep) =>
                !ep.skipped &&
                ep.defenseRating !== null &&
                ep.finishingRating !== null &&
                ep.shootingRating !== null &&
                ep.playmakingRating !== null,
            )
            .map((ep) => ep.rateeId);

          const leaderboardSnapshot = await tx
            .select({
              userId: leaderboard.userId,
              rank: leaderboard.rank,
            })
            .from(leaderboard)
            .where(
              and(
                eq(leaderboard.collegeId, collegeId),
                or(
                  isNotNull(leaderboard.rank),
                  inArray(leaderboard.userId, potentialRateeIds),
                ),
              ),
            );

          const oldRankMap = new Map<string, number | null>(
            leaderboardSnapshot.map((e) => [e.userId, e.rank]),
          );

          // Phase 2: Process all ratings (NO leaderboard reordering)
          for (const ep of encounteredPlayersData) {
            if (ep.skipped) continue;
            if (
              ep.defenseRating === null ||
              ep.finishingRating === null ||
              ep.shootingRating === null ||
              ep.playmakingRating === null
            ) {
              continue;
            }

            const {
              defenseRating,
              finishingRating,
              shootingRating,
              playmakingRating,
            } = ep;

            // Compute outlier weights
            const owDef = computeOutlierWeight(
              defenseRating,
              ep.rateeDefenseAtTime,
              ep.rateeLifetimeCount,
            );
            const owFin = computeOutlierWeight(
              finishingRating,
              ep.rateeFinishingAtTime,
              ep.rateeLifetimeCount,
            );
            const owSho = computeOutlierWeight(
              shootingRating,
              ep.rateeShootingAtTime,
              ep.rateeLifetimeCount,
            );
            const owPlay = computeOutlierWeight(
              playmakingRating,
              ep.rateePlaymakingAtTime,
              ep.rateeLifetimeCount,
            );

            const finalWeightDef = ep.combinedWeight * owDef;
            const finalWeightFin = ep.combinedWeight * owFin;
            const finalWeightSho = ep.combinedWeight * owSho;
            const finalWeightPlay = ep.combinedWeight * owPlay;

            const ratee = await tx.query.user.findFirst({
              where: eq(user.id, ep.rateeId),
              columns: {
                overall: true,
                archetype: true,
                defenseRating: true,
                finishingRating: true,
                shootingRating: true,
                playmakingRating: true,
                height: true,
              },
            });

            if (!ratee) continue;

            const newDefense = applyEMA(
              ratee.defenseRating,
              defenseRating,
              finalWeightDef,
            );
            const newFinishing = applyEMA(
              ratee.finishingRating,
              finishingRating,
              finalWeightFin,
            );
            const newShooting = applyEMA(
              ratee.shootingRating,
              shootingRating,
              finalWeightSho,
            );
            const newPlaymaking = applyEMA(
              ratee.playmakingRating,
              playmakingRating,
              finalWeightPlay,
            );

            const newOverall =
              (newDefense + newFinishing + newShooting + newPlaymaking) / 4;
            const newArchetype = generateArchetype(
              newDefense,
              newPlaymaking,
              newFinishing,
              newShooting,
              ratee.height!,
            );

            // Update user ratings
            await tx
              .update(user)
              .set({
                overall: Math.round(newOverall),
                defenseRating: Math.round(newDefense),
                finishingRating: Math.round(newFinishing),
                playmakingRating: Math.round(newPlaymaking),
                shootingRating: Math.round(newShooting),
                archetype: newArchetype,
              })
              .where(eq(user.id, ep.rateeId));

            // Insert rating WITHOUT rank data
            const [newRating] = await tx
              .insert(rating)
              .values({
                raterId: res.locals.userId!,
                rateeId: ep.rateeId,
                raterCourtSessionId: sessionId,
                rateeCourtSessionId: ep.courtSessionId,

                shootingRating,
                defenseRating,
                playmakingRating,
                finishingRating,

                raterOverallAtTime: ep.raterOverallAtTime,
                runCompetitivenessAtTime: ep.runCompetitivenessAtTime,
                finalWeightAppliedDefense: finalWeightDef,
                finalWeightAppliedFinishing: finalWeightFin,
                finalWeightAppliedPlaymaking: finalWeightPlay,
                finalWeightAppliedShooting: finalWeightSho,

                rateeOldOverall: ratee.overall,
                rateeNewOverall: Math.round(newOverall),
                rateeOldArchetype: ratee.archetype,
                rateeNewArchetype: newArchetype,
              })
              .returning({ id: rating.id });

            createdRatingIds.push(newRating.id);
            ratedUserIds.push(ep.rateeId);
          }

          const leaderboardEntries = await tx
            .select({
              userId: leaderboard.userId,
              overall: user.overall,
            })
            .from(leaderboard)
            .innerJoin(user, eq(leaderboard.userId, user.id))
            .where(
              and(
                eq(leaderboard.collegeId, collegeId),
                or(
                  isNotNull(leaderboard.rank),
                  inArray(leaderboard.userId, ratedUserIds),
                ),
              ),
            );

          const sorted = leaderboardEntries.sort(
            (a, b) => b.overall - a.overall,
          );

          for (let i = 0; i < sorted.length; i++) {
            const entry = sorted[i];
            await tx
              .update(leaderboard)
              .set({
                rank: i + 1,
                ...(ratedUserIds.includes(entry.userId) && {
                  lastRatedAt: new Date(),
                }),
              })
              .where(
                and(
                  eq(leaderboard.userId, entry.userId),
                  eq(leaderboard.collegeId, collegeId),
                ),
              );
          }

          // Phase 4: Create rankChange rows for everyone whose rank changed
          for (let i = 0; i < sorted.length; i++) {
            const entry = sorted[i];
            const newRank = i + 1;
            const oldRank = oldRankMap.get(entry.userId) ?? null;

            if (oldRank !== newRank) {
              const [rc] = await tx
                .insert(rankChange)
                .values({
                  userId: entry.userId,
                  collegeId,
                  raterCourtSessionId: sessionId,
                  oldRank,
                  newRank,
                })
                .returning({ id: rankChange.id });

              createdRankChangeIds.push(rc.id);
            }
          }

          await tx
            .update(courtSession)
            .set({ hasRated: true })
            .where(eq(courtSession.id, sessionId));

          return {
            ratingIds: createdRatingIds,
            rankChangeIds: createdRankChangeIds,
            rateeIds: ratedUserIds,
          };
        },
      );

      res.json({ success: true });

      await redis.set(`has_submitted_ratings:${res.locals.userId}`, "true");

      // Invalidate queries for rated users
      for (const rateeId of rateeIds) {
        invalidateQueries(["user", rateeId]);
        invalidateQueriesForUser(rateeId, ["home"]);
      }

      invalidateQueries(["court", targetCourtSession.courtId]);
      invalidateQueries([
        "court",
        targetCourtSession.courtId,
        "active-players",
      ]);
      invalidateQueries(["leaderboard", sessionCollegeId]);
      await invalidateHomeForCollege(sessionCollegeId);

      if (ratingIds.length > 0 || rankChangeIds.length > 0) {
        notificationsQueue.add("rating_effects", {
          type: "rating_effects",
          ratingIds,
          rankChangeIds,
        });
      }
    } catch (error) {
      handleError(error, res, "POST /court-sessions/:sessionId/ratings");
    }
  },
);

courtSessionsRoute.patch(
  "/court-sessions/:sessionId",
  authMiddleware,
  async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);

      if (isNaN(sessionId)) {
        return res.status(400).json({ error: "sessionId isNaN" });
      }

      const targetCourtSession = await db.query.courtSession.findFirst({
        where: and(
          eq(courtSession.id, sessionId),
          isNull(courtSession.endTime),
        ),
      });

      if (!targetCourtSession) {
        return res
          .status(404)
          .json({ error: "No active court session found." });
      }

      if (targetCourtSession.userId !== res.locals.userId) {
        return res
          .status(401)
          .json({ error: "Unauthorized for this court session." });
      }

      await db.transaction(async (tx) => {
        const [updatedCourtSession] = await tx
          .update(courtSession)
          .set({ endTime: new Date(), hasRated: false })
          .where(eq(courtSession.id, sessionId))
          .returning();

        await createEncounteredPlayersForSession(
          tx,
          updatedCourtSession,
          res.locals.userId!,
        );
      });

      const finalSession = await db.query.courtSession.findFirst({
        where: eq(courtSession.id, sessionId),
        columns: { hasRated: true },
      });

      if (finalSession && !finalSession.hasRated) {
        await sessionRatingReminderQueue.add(
          "remind_rating",
          {
            courtSessionId: sessionId,
            userId: res.locals.userId!,
            reminderCount: 0,
          },
          { delay: 60 * 60 * 1000 },
        );
      }

      const sessionCourt = await db.query.court.findFirst({
        where: eq(court.id, targetCourtSession.courtId),
        columns: { id: true, collegeId: true },
      });

      res.json({ success: true });

      invalidateQueries(["courts"], ["court", targetCourtSession.courtId]);
      invalidateQueries([
        "court",
        targetCourtSession.courtId,
        "active-players",
      ]);
      invalidateQueriesForUser(res.locals.userId!, ["home"]);
      if (sessionCourt) {
        await invalidateHomeForCollege(sessionCourt.collegeId);
      }
    } catch (error) {
      handleError(error, res, "PATCH /court-sessions/:sessionId");
    }
  },
);
