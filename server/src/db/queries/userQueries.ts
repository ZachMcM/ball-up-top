import { desc, eq } from "drizzle-orm";
import { db } from "../index";
import { court, courtSession, rating } from "../schema";

export function getOverallHistory({
  userId,
  limit = 25,
}: {
  userId: string;
  limit?: number;
}) {
  return db
    .select({
      overall: rating.rateeNewOverall,
      createdAt: rating.createdAt,
    })
    .from(rating)
    .where(eq(rating.rateeId, userId))
    .orderBy(rating.createdAt)
    .limit(limit);
}

export function getRecentSessions({
  userId,
  limit = 5,
}: {
  userId: string;
  limit?: number;
}) {
  return db
    .select({
      id: courtSession.id,
      startTime: courtSession.startTime,
      endTime: courtSession.endTime,
      court: {
        id: court.id,
        name: court.name,
        image: court.image,
        collegeName: court.collegeName,
        collegeColor: court.collegeColor,
      },
    })
    .from(courtSession)
    .innerJoin(court, eq(courtSession.courtId, court.id))
    .where(eq(courtSession.userId, userId))
    .orderBy(desc(courtSession.startTime))
    .limit(limit);
}
