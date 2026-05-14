export type HomeResponse = {
  userData: {
    name: string;
    archetype: string;
    overall: number;
    rank: number | null;
    rankDelta: number | null;
  };
  activePlayers: {
    id: string
    name: string;
    overall: number;
    archetype: string;
    image: string | null;
  }[];
  primaryCourt: {
    id: number,
    name: string;
    address: string,
    collegeName: string;
    collegeColor: string;
  };
};
