import { CourtLeaderboard } from './court';
import { RatingHistoryPoint, User, UserSession } from './user';

export type MinimalCourt = {
  id: number;
  name: string;
  image: string;
  indoor: boolean;
  address: string;
  collegeName: string;
  collegeColor: string;
  distance: number;
  currentActiveSessions: number;
  currentActiveUsers: User[];
  leaderboard: CourtLeaderboard;
};

export type HomeResponse = {
  user: Pick<User, 'id' | 'name' | 'image' | 'overall' | 'height' | 'archetype'>;
  overallHistory: RatingHistoryPoint[];
  recentSession: UserSession | null;
  primaryCourt: MinimalCourt;
};
