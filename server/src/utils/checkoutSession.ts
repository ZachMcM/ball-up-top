import { and, eq, gt, InferSelectModel, isNull, lt, ne, or, sql } from "drizzle-orm";
import {
  EST_RATINGS_PER_SESS,
  EXPERIENCE_GROWTH_RT,
  MAX_EXPERIENCE_WT,
  MAX_OVERLAP_WT,
  MIN_EXPERIENCE_WT,
  MIN_OVERLAP_WT,
  OVERLAP_MS_THRESH,
  RATER_MAX_WT,
  RATER_MIN_WT,
  RUN_COMP_MAX_WT,
  RUN_COMP_MIN_WT,
  WEIGHT_E,
} from "../config/ratings";
import { db } from "../db";
import { courtSession, encounteredPlayer, rating, user } from "../db/schema";
import { clamp } from "./clamp";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function getEncounteredPlayers(
  targetCourtSession: InferSelectModel<typeof courtSession>,
): Promise<{ overlapWeight: number; user: InferSelectModel<typeof user> }[]> {
  const overlappingSessions = await db.query.courtSession.findMany({
    where: and(
      eq(courtSession.courtId, targetCourtSession.courtId),
      ne(courtSession.id, targetCourtSession.id),
      lt(courtSession.startTime, targetCourtSession.endTime!),
      or(
        isNull(courtSession.endTime),
        gt(courtSession.endTime, targetCourtSession.startTime),
      ),
      sql`DATE(${courtSession.startTime}) = DATE(${targetCourtSession.startTime})`,
    ),
    with: { user: true },
  });

  const myStart = targetCourtSession.startTime;
  const myEnd = targetCourtSession.endTime!;
  const maxOverlapMs = myEnd.getTime() - myStart.getTime();
  const now = new Date();

  const uniquePlayers = new Map<
    string,
    { user: InferSelectModel<typeof user>; overlapWeight: number }
  >();

  for (const s of overlappingSessions) {
    const otherStart = s.startTime;
    const otherEnd = s.endTime ?? now;

    const overlapStart = new Date(Math.max(myStart.getTime(), otherStart.getTime()));
    const overlapEnd = new Date(Math.min(myEnd.getTime(), otherEnd.getTime()));
    const overlapMs = overlapEnd.getTime() - overlapStart.getTime();

    if (overlapMs >= OVERLAP_MS_THRESH && !uniquePlayers.has(s.user.id)) {
      uniquePlayers.set(s.user.id, {
        user: s.user,
        overlapWeight: clamp(MIN_OVERLAP_WT, MAX_OVERLAP_WT, overlapMs / maxOverlapMs),
      });
    }
  }

  return [...uniquePlayers.values()];
}

function computeExperienceWeight(sessionsPlayed: number, ratingsGiven: number) {
  const base = Math.max(sessionsPlayed, Math.floor(ratingsGiven / EST_RATINGS_PER_SESS));
  const raw = MIN_EXPERIENCE_WT + Math.log1p(base) / EXPERIENCE_GROWTH_RT;
  return clamp(MIN_EXPERIENCE_WT, MAX_EXPERIENCE_WT, raw);
}

/**
 * After a session's endTime has been set, this creates all encounteredPlayer rows
 * (or marks hasRated=true when there are no co-players). Must be called inside a
 * transaction that has already committed the updated endTime.
 */
export async function createEncounteredPlayersForSession(
  tx: Tx,
  updatedSession: InferSelectModel<typeof courtSession>,
  raterId: string,
): Promise<void> {
  const encounteredPlayersData = await getEncounteredPlayers(updatedSession);

  if (encounteredPlayersData.length === 0) {
    await tx
      .update(courtSession)
      .set({ hasRated: true })
      .where(eq(courtSession.id, updatedSession.id));
    return;
  }

  const rater = (await tx.query.user.findFirst({
    where: eq(user.id, raterId),
    columns: { overall: true },
    with: {
      courtSessions: { columns: { id: true } },
      outgoingRatings: { columns: { id: true } },
    },
  }))!;

  const runCompetitiveness = clamp(
    RUN_COMP_MIN_WT,
    RUN_COMP_MAX_WT,
    encounteredPlayersData.reduce((acc, ep) => acc + ep.user.overall, 0) /
      encounteredPlayersData.length /
      100,
  );

  const raterWeight = clamp(RATER_MIN_WT, RATER_MAX_WT, rater.overall / 100);
  const experienceWeight = computeExperienceWeight(
    rater.courtSessions.length,
    rater.outgoingRatings.length,
  );

  for (let i = 0; i < encounteredPlayersData.length; i++) {
    const { user: ratee, overlapWeight } = encounteredPlayersData[i];

    const lifetimeCount = await tx
      .select()
      .from(rating)
      .where(eq(rating.rateeId, ratee.id));

    const combinedWeight = Math.pow(
      raterWeight * experienceWeight * runCompetitiveness * overlapWeight,
      WEIGHT_E,
    );

    await tx.insert(encounteredPlayer).values({
      courtSessionId: updatedSession.id,
      rateeId: ratee.id,
      combinedWeight,
      raterOverallAtTime: rater.overall,
      runCompetitivenessAtTime: runCompetitiveness,
      rateeDefenseAtTime: ratee.defenseRating,
      rateeFinishingAtTime: ratee.finishingRating,
      rateeShootingAtTime: ratee.shootingRating,
      rateePlaymakingAtTime: ratee.playmakingRating,
      rateeOverallAtTime: ratee.overall,
      rateeLifetimeCount: lifetimeCount.length,
      rateeName: ratee.name,
      rateeImage: ratee.image,
      rateeArchetype: ratee.archetype,
      rateeHeight: ratee.height,
      defenseRating: null,
      finishingRating: null,
      shootingRating: null,
      playmakingRating: null,
      skipped: false,
      displayOrder: i,
    });
  }
}
