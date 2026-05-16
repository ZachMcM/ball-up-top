import { asc, eq } from "drizzle-orm";
import { db } from "../db";
import { college, court } from "../db/schema";
import { redis } from "./redis";

const TTL_SECONDS = 60 * 60 * 24;

export type CollegeMetadata = {
  id: number;
  name: string;
  state: string;
  city: string;
  primaryColor: string;
  secondaryColor: string;
  abbreviation: string;
};

export type CourtListItem = {
  id: number;
  name: string;
  address: string;
  image: string;
};

export type CourtMetadata = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  image: string;
};

export async function getAllColleges(): Promise<CollegeMetadata[]> {
  const cached = await redis.get("colleges:all");
  if (cached) return JSON.parse(cached);

  const rows = await db
    .select({
      id: college.id,
      name: college.name,
      state: college.state,
      city: college.city,
      primaryColor: college.primaryColor,
      secondaryColor: college.secondaryColor,
      abbreviation: college.abbreviation,
    })
    .from(college)
    .orderBy(asc(college.name));

  await redis.set("colleges:all", JSON.stringify(rows), { EX: TTL_SECONDS });
  return rows;
}

export async function getCollegeById(
  collegeId: number,
): Promise<CollegeMetadata | null> {
  const key = `college:${collegeId}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const [row] = await db
    .select({
      id: college.id,
      name: college.name,
      state: college.state,
      city: college.city,
      primaryColor: college.primaryColor,
      secondaryColor: college.secondaryColor,
      abbreviation: college.abbreviation,
    })
    .from(college)
    .where(eq(college.id, collegeId));

  if (!row) return null;

  await redis.set(key, JSON.stringify(row), { EX: TTL_SECONDS });
  return row;
}

export async function getCourtsByCollege(
  collegeId: number,
): Promise<CourtListItem[]> {
  const key = `courts:college:${collegeId}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const rows = await db
    .select({
      id: court.id,
      name: court.name,
      address: court.address,
      image: court.image,
    })
    .from(court)
    .where(eq(court.collegeId, collegeId))
    .orderBy(asc(court.name));

  await redis.set(key, JSON.stringify(rows), { EX: TTL_SECONDS });
  return rows;
}

export async function getCourtById(
  courtId: number,
): Promise<CourtMetadata | null> {
  const key = `court:${courtId}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const [row] = await db
    .select({
      id: court.id,
      name: court.name,
      address: court.address,
      lat: court.lat,
      lng: court.lng,
      image: court.image,
    })
    .from(court)
    .where(eq(court.id, courtId));

  if (!row) return null;

  await redis.set(key, JSON.stringify(row), { EX: TTL_SECONDS });
  return row;
}
