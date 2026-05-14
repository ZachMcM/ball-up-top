export type CollegeOption = {
  courtId: number;
  collegeName: string;
  collegeColor: string;
};

export type CourtSession = {
  id: number;
  userId: string;
  courtId: number;
  startTime: Date;
  endTime: Date | null;
  hasRated: boolean;
};

export type UserEntry = {
  rank: number | null;
  overall: number;
  id: string;
  name: string;
  image: string | null;
  archetype: string;
};

export type Leaderboard = {
  court: CourtResponse,
  users: UserEntry[];
  topMovers: (UserEntry & {
    oldRank: number | null;
    rankImprovement: number;
  })[];
};

export type CourtResponse = {
  id: number;
  name: string;
  address: string;
  collegeName: string;
  collegeColor: string;
  lat: number;
  lng: number;
};
