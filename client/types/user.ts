export type User = {
  id: string;
  name: string;
  image: string | null;
  archetype: string;
  height: string | null;
  overall: number;
  finishingRating: number;
  playmakingRating: number;
  defenseRating: number;
  shootingRating: number;
  rank: number | null;
  primaryCollegeName: string;
};
