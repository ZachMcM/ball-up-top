import {
  and,
  eq,
  gt,
  InferSelectModel,
  isNotNull,
  isNull,
  lt,
  ne,
  or,
  sql,
} from "drizzle-orm";
import { Router } from "express";
import { handleError } from "../utils/handleError";
import { authMiddleware } from "../utils/middleware";
import { db } from "../db";
import {
  courtSession,
  encounteredPlayer,
  rating,
  user,
} from "../db/schema";

import * as z from "zod";
import { clamp } from "../utils/clamp";
import { generateArchetype } from "../utils/generateArchetype";
import {
  EST_RATINGS_PER_SESS,
  EXPERIENCE_GROWTH_RT,
  MAX_EXPERIENCE_WT,
  MAX_OVERLAP_WT,
  MAX_OVR,
  MAX_SHIFT,
  MIN_EXPERIENCE_WT,
  MIN_LIFETIME_CT,
  MIN_OVERLAP_WT,
  MIN_OVR,
  OVERLAP_DIFF_THRESH_1,
  OVERLAP_DIFF_THRESH_2,
  OVERLAP_DIFF_THRESH_2_WT,
  OVERLAP_MS_THRESH,
  RATER_MAX_WT,
  RATER_MIN_WT,
  RUN_COMP_MAX_WT,
  RUN_COMP_MIN_WT,
  WEIGHT_E,
} from "../config/ratings";
import { logger } from "../utils/logger";
import { invalidateQueries } from "../utils/invalidateQueries";
import { notificationsQueue } from "../queues/notifications.queue";

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
        hasRated !== undefined ? eq(courtSession.hasRated, hasRated) : undefined
      ),
    });

    return res.json(existingCourtSession);
  } catch (error) {
    handleError(error, res, "GET /court-sessions");
  }
});

async function getEncounteredPlayers(
  targetCourtSession: InferSelectModel<typeof courtSession>
): Promise<
  {
    overlapWeight: number;
    user: InferSelectModel<typeof user>;
  }[]
> {
  const overlappingSessions = await db.query.courtSession.findMany({
    where: and(
      eq(courtSession.courtId, targetCourtSession.courtId),
      ne(courtSession.id, targetCourtSession.id),
      lt(courtSession.startTime, targetCourtSession.endTime!),
      or(
        isNull(courtSession.endTime),
        gt(courtSession.endTime, targetCourtSession.startTime)
      ),
      // Protect against lingering sessions from previous days
      sql`DATE(${courtSession.startTime}) = DATE(${targetCourtSession.startTime})`
    ),
    with: {
      user: true,
    },
  });

  const myStart = targetCourtSession.startTime;
  const myEnd = targetCourtSession.endTime!;
  const maxOverlapMs = myEnd.getTime() - myStart.getTime();
  const now = new Date();

  const uniquePlayers = new Map();

  overlappingSessions.forEach((s) => {
    const otherStart = s.startTime;
    const otherEnd = s.endTime ?? now;

    const overlapStart = new Date(
      Math.max(myStart.getTime(), otherStart.getTime())
    );
    const overlapEnd = new Date(Math.min(myEnd.getTime(), otherEnd.getTime()));

    const overlapMs = overlapEnd.getTime() - overlapStart.getTime();

    if (overlapMs >= OVERLAP_MS_THRESH) {
      if (!uniquePlayers.has(s.user.id)) {
        uniquePlayers.set(s.user.id, {
          user: s.user,
          overlapWeight: clamp(
            MIN_OVERLAP_WT,
            MAX_OVERLAP_WT,
            overlapMs / maxOverlapMs
          ),
        });
      }
    }
  });

  return [...uniquePlayers.values()];
}

function computeExperienceWeight(sessionsPlayed: number, ratingsGiven: number) {
  const base = Math.max(
    sessionsPlayed,
    Math.floor(ratingsGiven / EST_RATINGS_PER_SESS)
  );
  const raw = MIN_EXPERIENCE_WT + Math.log1p(base) / EXPERIENCE_GROWTH_RT;
  return clamp(MIN_EXPERIENCE_WT, MAX_EXPERIENCE_WT, raw);
}

function computeOutlierWeight(
  newRaw: number,
  oldRaw: number,
  lifetimeCount: number
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

      const encounteredPlayers = await getEncounteredPlayers(
        targetCourtSession
      );

      return res.json(encounteredPlayers.map((ep) => ep.user));
    } catch (error) {
      handleError(error, res, "GET /court-sessions/:sessionId/players");
    }
  }
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
        "GET /court-sessions/:sessionId/encountered-players"
      );
    }
  }
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

      // Verify session hasn't been rated yet
      if (ep.courtSession.hasRated) {
        return res
          .status(400)
          .json({ error: "Session has already been rated." });
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
  }
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

      const ratingIds: number[] = [];

      await db.transaction(async (tx) => {
        for (const ep of encounteredPlayersData) {
          // Skip if player was skipped or ratings are incomplete
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

          // Compute outlier weights using frozen ratee ratings and lifetime count
          const owDef = computeOutlierWeight(
            defenseRating,
            ep.rateeDefenseAtTime,
            ep.rateeLifetimeCount
          );
          const owFin = computeOutlierWeight(
            finishingRating,
            ep.rateeFinishingAtTime,
            ep.rateeLifetimeCount
          );
          const owSho = computeOutlierWeight(
            shootingRating,
            ep.rateeShootingAtTime,
            ep.rateeLifetimeCount
          );
          const owPlay = computeOutlierWeight(
            playmakingRating,
            ep.rateePlaymakingAtTime,
            ep.rateeLifetimeCount
          );

          // Compute final weights using precomputed combined weight
          const finalWeightDef = ep.combinedWeight * owDef;
          const finalWeightFin = ep.combinedWeight * owFin;
          const finalWeightSho = ep.combinedWeight * owSho;
          const finalWeightPlay = ep.combinedWeight * owPlay;

          // Fetch ratee's CURRENT (live) ratings for EMA
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

          // Apply EMA to LIVE ratings
          const newDefense = applyEMA(
            ratee.defenseRating,
            defenseRating,
            finalWeightDef
          );
          const newFinishing = applyEMA(
            ratee.finishingRating,
            finishingRating,
            finalWeightFin
          );
          const newShooting = applyEMA(
            ratee.shootingRating,
            shootingRating,
            finalWeightSho
          );
          const newPlaymaking = applyEMA(
            ratee.playmakingRating,
            playmakingRating,
            finalWeightPlay
          );

          const newOverall =
            (newDefense + newFinishing + newShooting + newPlaymaking) / 4;

          const newArchetype = generateArchetype(
            newDefense,
            newPlaymaking,
            newFinishing,
            newShooting,
            ratee.height!
          );

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

          const [newRating] = await tx
            .insert(rating)
            .values({
              raterId: res.locals.userId!,
              rateeId: ep.rateeId,
              raterCourtSession: sessionId,

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

          ratingIds.push(newRating.id);

          invalidateQueries(["user", ep.rateeId]);
        }

        await tx
          .update(courtSession)
          .set({ hasRated: true })
          .where(eq(courtSession.id, sessionId));
      });

      invalidateQueries(
        ["court", targetCourtSession.courtId],
      );

      res.json({ success: true });

      // Queue ratings activity processing
      if (ratingIds.length > 0) {
        notificationsQueue.add("ratings_activity", {
          type: "ratings_activity",
          ratingIds,
        });
      }
    } catch (error) {
      handleError(error, res, "POST /court-sessions/:sessionId/ratings");
    }
  }
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
          isNull(courtSession.endTime)
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

      const [updatedCourtSession] = await db
        .update(courtSession)
        .set({
          endTime: new Date(),
          hasRated: false,
        })
        .where(eq(courtSession.id, sessionId))
        .returning();

      const encounteredPlayersData = await getEncounteredPlayers(
        updatedCourtSession
      );

      // bypass rating if no encountered players
      if (encounteredPlayersData.length === 0) {
        await db
          .update(courtSession)
          .set({
            hasRated: true,
          })
          .where(eq(courtSession.id, sessionId));
      } else {
        // Fetch rater info for weight computation
        const rater = (await db.query.user.findFirst({
          where: eq(user.id, res.locals.userId!),
          columns: {
            overall: true,
          },
          with: {
            courtSessions: {
              columns: {
                id: true,
              },
            },
            outgoingRatings: {
              columns: {
                id: true,
              },
            },
          },
        }))!;

        // Compute session-level weights
        const runCompetitiveness = clamp(
          RUN_COMP_MIN_WT,
          RUN_COMP_MAX_WT,
          encounteredPlayersData.reduce(
            (accum, curr) => accum + curr.user.overall,
            0
          ) /
            encounteredPlayersData.length /
            100
        );

        const raterWeight = clamp(
          RATER_MIN_WT,
          RATER_MAX_WT,
          rater.overall / 100
        );

        const experienceWeight = computeExperienceWeight(
          rater.courtSessions.length,
          rater.outgoingRatings.length
        );

        // Create encountered_player rows with precomputed data
        for (let i = 0; i < encounteredPlayersData.length; i++) {
          const ep = encounteredPlayersData[i];
          const ratee = ep.user;

          // Get ratee's lifetime rating count (not session count)
          const lifetimeCount = await db
            .select()
            .from(rating)
            .where(eq(rating.rateeId, ratee.id));

          // Compute combined weight (without outlier weight)
          const combinedWeight = Math.pow(
            raterWeight *
              experienceWeight *
              runCompetitiveness *
              ep.overlapWeight,
            WEIGHT_E
          );

          await db.insert(encounteredPlayer).values({
            courtSessionId: sessionId,
            rateeId: ratee.id,

            // Precomputed weights
            combinedWeight,
            raterOverallAtTime: rater.overall,
            runCompetitivenessAtTime: runCompetitiveness,

            // Ratee's ratings at checkout (for outlier detection)
            rateeDefenseAtTime: ratee.defenseRating,
            rateeFinishingAtTime: ratee.finishingRating,
            rateeShootingAtTime: ratee.shootingRating,
            rateePlaymakingAtTime: ratee.playmakingRating,
            rateeOverallAtTime: ratee.overall,
            rateeLifetimeCount: lifetimeCount.length,

            // Ratee display info (frozen for UI)
            rateeName: ratee.name,
            rateeImage: ratee.image,
            rateeArchetype: ratee.archetype,
            rateeHeight: ratee.height,

            // Draft ratings (null initially)
            defenseRating: null,
            finishingRating: null,
            shootingRating: null,
            playmakingRating: null,
            skipped: false,
            displayOrder: i,
          });
        }
      }

      invalidateQueries(
        ["courts"],
        ["court", targetCourtSession.courtId],
      );

      res.json({ success: true });

      // Queue session completed activity
      notificationsQueue.add("session_completed", {
        type: "session_completed",
        userId: res.locals.userId!,
        courtSessionId: targetCourtSession.id,
      });
    } catch (error) {
      handleError(error, res, "PATCH /court-sessions/:sessionId");
    }
  }
);
