export type Activity = {
  id: number;
  createdAt: Date;
  userId: string;
  type: 'overall_change' | 'rank_change' | 'archetype_change' | 'rating';
  ratingId: number | null;
  read: boolean;
  rating: {
    rateeOldOverall: number;
    rateeNewOverall: number;
    rateeOldArchetype: string;
    rateeNewArchetype: string;
    rater: {
      id: string;
      name: string;
      image: string;
    };
    rateeCourtSession: {
      court: {
        id: number;
        name: string;
      };
    };
  } | null;
  rankChange: {
    oldRank: number;
    newRank: number;
    college: {
      id: number;
      name: string;
      abbreviation: string;
    };
  } | null;
};
