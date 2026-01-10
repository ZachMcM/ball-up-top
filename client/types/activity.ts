import { CourtListEntry, CourtSession } from "./court";
import { Rating } from "./rating";
import { User } from "./user";

export type Activity = {
  id: number;
  createdAt: Date;
  userId: string;
  courtId: number | null;
  courtSessionId: number | null;
  type:
    | 'rating_received'
    | 'session_completed'
    | 'rating_milestone'
    | 'archetype_changed'
    | 'court_activity';
  ratingId: number | null;
  read: boolean;
  court: CourtListEntry | null,
  courtSession: CourtSession & { court: CourtListEntry } | null
  rating: Rating & { rater: User } | null
};
