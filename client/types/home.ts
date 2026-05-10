export type HomeResponse = {
  userData: {
    name: string;
    archetype: string;
    overall: number;
    rank: number | null;
    overallDelta: number | null;
    rankDelta: number | null;
  }[];
  activePlayers: {
    name: string;
    overall: number;
    archetype: string;
    image: string | null;
  }[];
  primaryCourt: {
    name: string;
    collegeName: string;
    collegeColor: string;
  }[];
};
