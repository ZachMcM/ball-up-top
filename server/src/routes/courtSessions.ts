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
import { handleError } from "../../utils/handleError";
import { authMiddleware } from "../../utils/middleware";
import { db } from "../db";
import { courtSession, rating, user } from "../db/schema";

import * as z from "zod";
import { clamp } from "../../utils/clamp";
import { generateArchetype } from "../../utils/generateArchetype";
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
} from "../config/ratings";
import { logger } from "../../utils/logger";

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

    const existingCourtSessions = await db.query.courtSession.findMany({
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

    return res.json(existingCourtSessions);
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

const BatchRatings = z.object({
  ratings: z.array(
    z.object({
      userId: z.string(),
      defenseRating: z.number().int().min(MIN_OVR).max(MAX_OVR),
      finishingRating: z.number().int().min(MIN_OVR).max(MAX_OVR),
      shootingRating: z.number().int().min(MIN_OVR).max(MAX_OVR),
      playmakingRating: z.number().int().min(MIN_OVR).max(MAX_OVR),
    })
  ),
});

// TODO add activity entry

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

      const validBody = BatchRatings.safeParse(req.body);
      if (!validBody.success) {
        return res.status(400).json({ error: validBody.error.message });
      }

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

      const encounteredPlayers = await getEncounteredPlayers(
        targetCourtSession
      );

      if (encounteredPlayers.length === 0) {
        return res.status(400).json({
          error: "No encountered players found for this session.",
        });
      }

      const encounteredMap = new Map();
      encounteredPlayers.forEach((p) =>
        encounteredMap.set(p.user.id, p.overlapWeight)
      );

      const runCompetitiveness = clamp(
        RUN_COMP_MIN_WT,
        RUN_COMP_MAX_WT,
        encounteredPlayers.reduce(
          (accum, curr) => accum + curr.user.overall,
          0
        ) /
          encounteredPlayers.length /
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

      const { ratings } = validBody.data;

      await db.transaction(async (tx) => {
        for (const ratingInput of ratings) {
          const rateeId = ratingInput.userId;

          const overlapWeight = encounteredMap.get(rateeId) as number;
          if (overlapWeight === undefined) continue;

          const {
            defenseRating,
            finishingRating,
            shootingRating,
            playmakingRating,
          } = ratingInput;

          const ratee = await tx.query.user.findFirst({
            where: eq(user.id, rateeId),
            columns: {
              defenseRating: true,
              finishingRating: true,
              shootingRating: true,
              playmakingRating: true,
              overall: true,
              height: true,
            },
          });

          if (!ratee) continue;

          const lifetimeCount = await tx
            .select()
            .from(courtSession)
            .where(eq(courtSession.userId, rateeId));

          const owDef = computeOutlierWeight(
            defenseRating,
            ratee.defenseRating,
            lifetimeCount.length
          );
          const owFin = computeOutlierWeight(
            finishingRating,
            ratee.finishingRating,
            lifetimeCount.length
          );
          const owSho = computeOutlierWeight(
            shootingRating,
            ratee.shootingRating,
            lifetimeCount.length
          );
          const owPlay = computeOutlierWeight(
            playmakingRating,
            ratee.playmakingRating,
            lifetimeCount.length
          );

          const combinedWeights =
            raterWeight * experienceWeight * runCompetitiveness * overlapWeight;

          const finalWeightDef = combinedWeights * owDef;
          const finalWeightFin = combinedWeights * owFin;
          const finalWeightSho = combinedWeights * owSho;
          const finalWeightPlay = combinedWeights * owPlay;

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
            .where(eq(user.id, rateeId));

          await tx.insert(rating).values({
            raterId: res.locals.userId!,
            rateeId,
            raterCourtSession: sessionId,
            shootingRating,
            defenseRating,
            playmakingRating,
            finishingRating,
            raterOverallAtTime: rater.overall,
            runCompetitivenessAtTime: runCompetitiveness,
            finalWeightAppliedDefense: finalWeightDef,
            finalWeightAppliedFinishing: finalWeightFin,
            finalWeightAppliedPlaymaking: finalWeightPlay,
            finalWeightAppliedShooting: finalWeightSho,
          });
        }

        await tx
          .update(courtSession)
          .set({ hasRated: true })
          .where(eq(courtSession.id, sessionId));
      });

      return res.json({ success: true });
    } catch (error) {
      handleError(error, res, "POST /court-sessions/:sessionId/ratings");
    }
  }
);

// TODO add activity entry

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

      await db
        .update(courtSession)
        .set({
          endTime: new Date(),
          hasRated: false,
        })
        .where(eq(courtSession.id, sessionId));

      return res.json({ success: true });
    } catch (error) {
      handleError(error, res, "PATCH /court-sessions/:sessionId");
    }
  }
);
