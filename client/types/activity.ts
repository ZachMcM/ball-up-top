import { User } from './user';

export type Activity = {
  id: number;
  createdAt: Date;
  userId: string;
  courtId: number | null;
  courtSessionId: number | null;
  type: 'overall_change' | 'rank_change' | 'archetype_change';
  ratingId: number | null;
  read: boolean;
  court: {
    id: number;
    name: string;
    collegeName: string;
    collegeColor: string;
  };
  rating: ({ rateeOldOverall: number; rateeNewOverall: number } & { rater: User }) | null;
  rankChange: { oldRank: number; newRank: number } | null;
};
