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
  };
};

export type ExtendedUser = User & {
  ratingHistory: RatingHistoryPoint[];
  recentSessions: UserSession[];
  // @deprecated
  // bookmarkedCourts: {
  //   id: number;
  //   name: string;
  //   address: string;
  //   lat: number;
  //   lng: number;
  //   indoor: boolean;
  //   verified: boolean;
  //   image: string;
  // }[];
};
