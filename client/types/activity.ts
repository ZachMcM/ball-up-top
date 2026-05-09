import { CourtListEntry, CourtSession } from './court';
import { Rating } from './rating';
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
  court: CourtListEntry | null;
  courtSession: (CourtSession & { court: CourtListEntry }) | null;
  rating: (Rating & { rater: User }) | null;
};
