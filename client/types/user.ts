export type User = {
  id: string;
  name: string;
  image: string;
  overall: number;
  finishingRating: number;
  playmakingRating: number;
  defenseRating: number;
  shootingRating: number;
  archetype: string;
  height: string;
};

export type RatingHistoryPoint = {
  overall: number;
  createdAt: Date;
};

export type UserSession = {
  id: number;
  startTime: string;
  endTime: string | null;
  court: {
    id: number;
    name: string;
    image: string;
    collegeName: string;
    collegeColor: string;
  };
};

export type ExtendedUser = User & {
  ratingHistory: RatingHistoryPoint[];
  recentSessions: UserSession[];
};
