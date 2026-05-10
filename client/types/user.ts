export type User = {
  name: string;
  archetype: string;
  height: string | null;
  overall: number;
  finishingRating: number;
  playmakingRating: number;
  defenseRating: number;
  shootingRating: number;
  rank: number | null;
  overallDelta: number | null;
  rankDelta: number | null;
};
