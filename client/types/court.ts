import * as z from 'zod';
import { User } from './user';

export type Place = z.infer<typeof PlaceSchema>;

export const PlaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  formattedAddress: z.string(),
});

export type CourtListEntry = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  indoor: boolean;
  verified: boolean;
  image: string;
  distance: number;
  avgPlayerOverall: number;
  currentActiveSessions: number;
  activityGraph: {
    hour: number;
    avgSessions: number;
  }[];
};

export type Court = CourtListEntry & {
  currentActiveUsers: User[];
  leaderboard: User[];
};

export type CourtSession = {
  id: number;
  userId: string;
  courtId: number;
  startTime: Date;
  endTime: Date | null;
  hasRated: boolean;
};
