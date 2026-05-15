export type College = {
  id: number;
  name: string;
  state: string;
  city: string;
  primaryColor: string;
  secondaryColor: string;
};

export type CollegeLeaderboardUser = {
  rank: number | null;
  overall: number;
  id: string;
  name: string;
  image: string | null;
  archetype: string;
};

export type CollegeLeaderboard = {
  college: College;
  users: CollegeLeaderboardUser[];
  topMovers: (CollegeLeaderboardUser & {
    oldRank: number | null;
    rankImprovement: number;
  })[];
};
