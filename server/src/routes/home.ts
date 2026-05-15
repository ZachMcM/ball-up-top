import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db";
import {
  college,
  court,
  courtSession,
  leaderboard,
  rankChange,
  user,
} from "../db/schema";
import { handleError } from "../utils/handleError";
import { authMiddleware } from "../utils/middleware";

export const homeRoute = Router();

homeRoute.get("/home", authMiddleware, async (_, res) => {
  try {
    const userId = res.locals.userId!;

    const [currentUser] = await db
      .select({
        id: user.id,
        primaryCollegeId: user.primaryCollegeId,
      })
      .from(user)
      .where(eq(user.id, userId));

    if (!currentUser?.primaryCollegeId) {
      return res
        .status(400)
        .json({ error: "User has no primary college selected." });
    }

    const collegeId = currentUser.primaryCollegeId;

    const [[userData], [primaryCollege], courts, activePlayerRows] =
      await Promise.all([
        db
          .select({
            name: user.name,
            archetype: user.archetype,
            overall: user.overall,
            rank: leaderboard.rank,
            rankDelta: sql<number | null>`(
              SELECT ${rankChange.newRank} - COALESCE(${rankChange.oldRank}, ${rankChange.newRank})
              FROM ${rankChange}
              WHERE ${rankChange.userId} = ${user.id}
                AND ${rankChange.collegeId} = ${user.primaryCollegeId}
              ORDER BY ${rankChange.createdAt} DESC
              LIMIT 1
            )`,
          })
          .from(user)
          .innerJoin(
            leaderboard,
            and(
              eq(user.primaryCollegeId, leaderboard.collegeId),
              eq(user.id, leaderboard.userId),
            ),
          )
          .where(eq(user.id, userId)),
        db
          .select({
            id: college.id,
            name: college.name,
            state: college.state,
            city: college.city,
            primaryColor: college.primaryColor,
            secondaryColor: college.secondaryColor,
          })
          .from(college)
          .where(eq(college.id, collegeId)),
        db
          .select({
            id: court.id,
            name: court.name,
            address: court.address,
          })
          .from(court)
          .where(eq(court.collegeId, collegeId))
          .orderBy(asc(court.name)),
        db
          .select({
            courtId: courtSession.courtId,
            id: user.id,
            name: user.name,
            overall: user.overall,
            archetype: user.archetype,
            image: user.image,
            startTime: courtSession.startTime,
          })
          .from(courtSession)
          .innerJoin(user, eq(courtSession.userId, user.id))
          .innerJoin(court, eq(courtSession.courtId, court.id))
          .where(
            and(
              eq(court.collegeId, collegeId),
              isNull(courtSession.endTime),
            ),
          )
          .orderBy(asc(courtSession.startTime)),
      ]);

    const playersByCourt = new Map<
      number,
      typeof activePlayerRows
    >();
    for (const row of activePlayerRows) {
      const list = playersByCourt.get(row.courtId);
      if (list) {
        list.push(row);
      } else {
        playersByCourt.set(row.courtId, [row]);
      }
    }

    const courtsWithActivity = courts.map((c) => {
      const players = playersByCourt.get(c.id) ?? [];
      return {
        id: c.id,
        name: c.name,
        address: c.address,
        activePlayerCount: players.length,
        activePlayers: players.slice(0, 3).map((p) => ({
          id: p.id,
          name: p.name,
          overall: p.overall,
          archetype: p.archetype,
          image: p.image,
        })),
      };
    });

    res.json({
      userData,
      primaryCollege,
      courts: courtsWithActivity,
    });
  } catch (error) {
    handleError(error, res, "GET /home");
  }
});
