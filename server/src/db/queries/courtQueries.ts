import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "../index";
import { courtSession, user } from "../schema";

export type LeaderboardRow = {
  rank: number;
  id: string;
  name: string;
  image: string | null;
  height: string | null;
  archetype: string;
  overall: number;
  finishingRating: number;
  defenseRating: number;
  playmakingRating: number;
  shootingRating: number;
};

export async function getCourtLeaderboard({
  courtId,
  limit = 10,
  currentUserId,
}: {
  courtId: number;
  limit?: number;
  currentUserId?: string;
}): Promise<{ top: LeaderboardRow[]; currentUser: LeaderboardRow | null }> {
  const result = await db.execute<LeaderboardRow>(sql`
    SELECT
      ROW_NUMBER() OVER (ORDER BY overall DESC)::integer as rank,
      *
    FROM (
      SELECT DISTINCT ON (u.id)
        u.id, u.name, u.image, u.height, u.archetype, u.overall,
        u.finishing_rating as "finishingRating",
        u.defense_rating as "defenseRating",
        u.playmaking_rating as "playmakingRating",
        u.shooting_rating as "shootingRating"
      FROM court_session cs
      INNER JOIN "user" u ON cs.user_id = u.id
      WHERE cs.court_id = ${courtId}
        AND cs.start_time >= NOW() - INTERVAL '30 days'
      ORDER BY u.id
    ) AS unique_users
    ORDER BY overall DESC
  `);

  const allRows = result.rows;
  const top = allRows.slice(0, limit);

  let currentUser: LeaderboardRow | null = null;
  if (currentUserId) {
    const inTop = top.some((row) => row.id === currentUserId);
    if (!inTop) {
      const userRow = allRows.find((row) => row.id === currentUserId);
      currentUser = userRow ?? null;
    }
  }

  return { top, currentUser };
}

export async function getCourtActivityGraph({ courtId }: { courtId: number }) {
  const result = await db.execute<{ hour: number; avgSessions: number }>(sql`
    SELECT
      hours.hour,
      CASE
        WHEN COUNT(cs.id) > 0 THEN
          COUNT(cs.id)::float / GREATEST(COUNT(DISTINCT DATE(cs.start_time AT TIME ZONE 'UTC')), 1)
        ELSE 0
      END as "avgSessions"
    FROM
      generate_series(0, 23) as hours(hour)
      LEFT JOIN court_session cs ON
        cs.court_id = ${courtId} AND
        EXTRACT(HOUR FROM cs.start_time AT TIME ZONE 'UTC')::integer = hours.hour
    GROUP BY hours.hour
    ORDER BY hours.hour
  `);

  return result.rows;
}

export async function getCourtSessionStats({ courtId }: { courtId: number }) {
  const [stats] = await db
    .select({
      avgPlayerOverall: sql<number>`AVG(${user.overall})::float`,
      currentActiveSessions: sql<number>`COUNT(*)::integer`,
    })
    .from(courtSession)
    .innerJoin(user, eq(courtSession.userId, user.id))
    .where(
      and(
        eq(courtSession.courtId, courtId),
        isNull(courtSession.endTime),
        sql`DATE(${courtSession.startTime}) = CURRENT_DATE`,
      ),
    );

  return {
    avgPlayerOverall: Number(stats?.avgPlayerOverall ?? 0),
    currentActiveSessions: Number(stats?.currentActiveSessions ?? 0),
  };
}

export function getCourtActivePlayers({
  courtId,
  limit,
}: {
  courtId: number;
  limit?: number;
}) {
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
    .from(courtSession)
    .innerJoin(user, eq(courtSession.userId, user.id))
    .where(
      and(
        eq(courtSession.courtId, courtId),
        isNull(courtSession.endTime),
        sql`DATE(${courtSession.startTime}) = CURRENT_DATE`,
      ),
    );

  return limit ? query.limit(limit) : query;
}
