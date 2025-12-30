export type EncounteredPlayer = {
  id: number;
  courtSessionId: number;
  rateeId: string;

  // Precomputed weights
  combinedWeight: number;
  raterOverallAtTime: number;
  runCompetitivenessAtTime: number;

  // Ratee's ratings at checkout (for outlier detection)
  rateeDefenseAtTime: number;
  rateeFinishingAtTime: number;
  rateeShootingAtTime: number;
  rateePlaymakingAtTime: number;
  rateeOverallAtTime: number;
  rateeLifetimeCount: number;

  // Ratee display info (frozen for UI)
  rateeName: string;
  rateeImage: string | null;
  rateeArchetype: string;
  rateeHeight: string | null;

  // Draft ratings (mutable)
  defenseRating: number | null;
  finishingRating: number | null;
  shootingRating: number | null;
  playmakingRating: number | null;
  skipped: boolean;
  displayOrder: number;

  createdAt: string;
  updatedAt: string;
};
