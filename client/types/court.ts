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
  image: string;
  collegeName: string;
  collegeColor: string;
  distance: number;
  avgPlayerOverall: number;
  currentActiveSessions: number;
  isNotificationEnabled?: boolean;
};

export type LeaderboardEntry = User & { rank: number };

export type CourtLeaderboard = {
  top: LeaderboardEntry[];
  currentUser: LeaderboardEntry | null;
};

export type Court = CourtListEntry & {
  activityGraph: {
    hour: number;
    avgSessions: number;
  }[];
  currentActiveUsers: User[];
  leaderboard: CourtLeaderboard;
};

export type CourtSession = {
  id: number;
  userId: string;
  courtId: number;
  startTime: Date;
  endTime: Date | null;
  hasRated: boolean;
};
