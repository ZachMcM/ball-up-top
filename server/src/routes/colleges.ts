import { and, asc, desc, eq, isNotNull, sql } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db";
import { leaderboard, rankChange, user } from "../db/schema";
import { getAllColleges, getCollegeById } from "../utils/cache";
import { handleError } from "../utils/handleError";
import { logger } from "../utils/logger";
import { authMiddleware } from "../utils/middleware";

export const collegesRoute = Router();

collegesRoute.get("/colleges", authMiddleware, async (_, res) => {
  try {
    const colleges = await getAllColleges();
    res.json(colleges);
  } catch (error) {
    handleError(error, res, "GET /colleges");
  }
});

collegesRoute.get(
  "/colleges/:id/leaderboard",
  authMiddleware,
  async (req, res) => {
    try {
      const collegeId = parseInt(req.params.id);

      if (!Number.isInteger(collegeId)) {
        logger.error("College ID is not an integer.");
        return res.status(400).json({ error: "College ID is not an integer." });
      }

      const [collegeData, leaderboardUsers, topMovers] = await Promise.all([
        getCollegeById(collegeId),
        db
          .select({
            rank: leaderboard.rank,
            overall: user.overall,
            id: user.id,
            name: user.name,
            image: user.image,
            archetype: user.archetype,
          })
          .from(leaderboard)
          .innerJoin(user, eq(leaderboard.userId, user.id))
          .where(eq(leaderboard.collegeId, collegeId))
          .orderBy(asc(leaderboard.rank)),
        db
          .selectDistinctOn([rankChange.userId], {
            overall: user.overall,
            oldRank: rankChange.oldRank,
            rank: rankChange.newRank,
            id: rankChange.userId,
            name: user.name,
            image: user.image,
            archetype: user.archetype,
            rankImprovement:
              sql<number>`(${rankChange.oldRank} - ${rankChange.newRank})`.as(
                "rank_improvement",
              ),
          })
          .from(rankChange)
          .innerJoin(user, eq(rankChange.userId, user.id))
          .where(
            and(
              eq(rankChange.collegeId, collegeId),
              isNotNull(rankChange.oldRank),
            ),
          )
          .orderBy(rankChange.userId, desc(rankChange.createdAt))
          .then((rows) =>
            rows
              .filter((r) => r.rankImprovement > 0)
              .sort((a, b) => b.rankImprovement - a.rankImprovement)
              .slice(0, 3),
          ),
      ]);

      res.json({ college: collegeData, users: leaderboardUsers, topMovers });
    } catch (error) {
      handleError(error, res, "GET /colleges/:id/leaderboard");
    }
  },
);
