export type Activity = {
  id: number;
  createdAt: Date;
  userId: string;
  type: 'overall_change' | 'rank_change' | 'archetype_change';
  ratingId: number | null;
  read: boolean;
  rating: {
    rateeOldOverall: number;
    rateeNewOverall: number;
    rateeOldArchetype: string;
    rateeNewArchetype: string;
  } | null;
  rankChange: { oldRank: number; newRank: number } | null;
};
