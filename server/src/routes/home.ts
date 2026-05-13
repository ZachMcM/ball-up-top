import { and, eq, isNull, sql } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db";
import {
  court,
  courtSession,
  leaderboard,
  rankChange,
  rating,
  user,
} from "../db/schema";
import { handleError } from "../utils/handleError";
import { authMiddleware } from "../utils/middleware";

export const homeRoute = Router();

homeRoute.get("/home", authMiddleware, async (_, res) => {
  try {
    const userId = res.locals.userId!;

    const [[userData], activePlayers, [primaryCourt]] = await Promise.all([
      db
        .select({
          name: user.name,
          archetype: user.archetype,
          overall: user.overall,
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
        .where(eq(user.id, userId)),
      db
        .select({
          id: user.id,
          name: user.name,
          overall: user.overall,
          archetype: user.archetype,
          image: user.image,
        })
        .from(courtSession)
        .innerJoin(user, eq(courtSession.userId, user.id))
        .where(isNull(courtSession.endTime)),
      db
        .select({
          address: court.address,
          id: court.id,
          name: court.name,
          collegeName: court.collegeName,
          collegeColor: court.collegeColor,
        })
        .from(user)
        .innerJoin(court, eq(user.primaryCourtId, court.id)),
    ]);

    res.json({
      userData,
      activePlayers,
      primaryCourt,
    });
  } catch (error) {
    handleError(error, res, "GET /home");
  }
});
