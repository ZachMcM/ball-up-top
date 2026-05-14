export type Activity = {
  id: number;
  createdAt: Date;
  userId: string;
  courtId: number | null;
  type: 'overall_change' | 'rank_change' | 'archetype_change';
  ratingId: number | null;
  read: boolean;
  court: {
    id: number;
    name: string;
    collegeName: string;
    collegeColor: string;
  } | null;
  rating: {
    rateeOldOverall: number;
    rateeNewOverall: number;
    rateeOldArchetype: string;
    rateeNewArchetype: string;
  } | null;
  rankChange: { oldRank: number; newRank: number } | null;
};
