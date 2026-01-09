import { and, sql } from "drizzle-orm";
import { Router } from "express";
import * as z from "zod";
import { handleError } from "../../utils/handleError";
import { logger } from "../../utils/logger";
import { authMiddleware } from "../../utils/middleware";
import { db } from "../db";
import { courtSession, user } from "../db/schema";

export const playersRoute = Router();

// Helper function to parse height string like "6'2" to inches
function parseHeightToInches(height: string): number | null {
  const match = height.match(/^(\d+)'(\d+)$/);
  if (!match) return null;
  const feet = parseInt(match[1], 10);
  const inches = parseInt(match[2], 10);
  return feet * 12 + inches;
}

const PlayersParamsSchema = z.object({
  limit: z.coerce.number().default(25),
  searchQuery: z.string().optional(),
  archetypes: z
    .string()
    .transform((val) => val.split(","))
    .optional(),
  minHeight: z.coerce.number().optional(),
  maxHeight: z.coerce.number().optional(),
  minOverall: z.coerce.number().optional(),
  sortBy: z
    .enum(["most_active", "overall_desc", "overall_asc"])
    .optional()
    .default("overall_desc"),
});

playersRoute.get("/players", authMiddleware, async (req, res) => {
  try {
    const validQueryParams = PlayersParamsSchema.safeParse(req.query);
    if (!validQueryParams.success) {
      return res.status(400).json({ error: validQueryParams.error.message });
    }

    const {
      limit,
      searchQuery,
      archetypes,
      minHeight,
      maxHeight,
      minOverall,
      sortBy,
    } = validQueryParams.data;

    // Build the conditions array
    const conditions = [];

    // Filter by name search
    if (searchQuery) {
      conditions.push(sql`${user.name} ILIKE ${`%${searchQuery}%`}`);
    }

    // Filter by archetypes (multi-select)
    if (archetypes && archetypes.length > 0) {
      conditions.push(sql`${user.archetype} = ANY(${archetypes})`);
    }

    // Filter by minimum overall
    if (minOverall !== undefined) {
      conditions.push(sql`${user.overall} >= ${minOverall}`);
    }

    // Filter by height range
    // We'll use a CASE statement to parse the height string in SQL
    if (minHeight !== undefined || maxHeight !== undefined) {
      const heightInInches = sql`(
        CASE
          WHEN ${user.height} ~ '^[0-9]+''[0-9]+$' THEN
            (CAST(SUBSTRING(${user.height} FROM '^([0-9]+)') AS INTEGER) * 12) +
            CAST(SUBSTRING(${user.height} FROM '''([0-9]+)$') AS INTEGER)
          ELSE NULL
        END
      )`;

      if (minHeight !== undefined) {
        conditions.push(sql`${heightInInches} >= ${minHeight}`);
      }
      if (maxHeight !== undefined) {
        conditions.push(sql`${heightInInches} <= ${maxHeight}`);
      }
    }

    // Build the query with session count
    const query = db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        height: user.height,
        archetype: user.archetype,
        overall: user.overall,
        sessionsCount30Days: sql<number>`
          COUNT(CASE
            WHEN ${courtSession.startTime} >= NOW() - INTERVAL '30 days'
            THEN 1
          END)::integer
        `.as("sessions_count_30_days"),
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

    // Apply sorting
    if (sortBy === "most_active") {
      query.orderBy(sql`sessions_count_30_days DESC`);
    } else if (sortBy === "overall_desc") {
      query.orderBy(sql`${user.overall} DESC`);
    } else if (sortBy === "overall_asc") {
      query.orderBy(sql`${user.overall} ASC`);
    }

    // Apply limit
    const players = await query.limit(limit);

    res.json(players);
  } catch (error) {
    handleError(error, res, "GET /players");
  }
});
