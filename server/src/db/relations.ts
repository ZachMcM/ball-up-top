import { relations } from "drizzle-orm";
import {
  account,
  activity,
  court,
  courtSession,
  encounteredPlayer,
  notificationCourt,
  rating,
  session,
  user,
} from "./schema";

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  createdCourts: many(court),
  courtSessions: many(courtSession),
  incomingRatings: many(rating, { relationName: "incomingRatings" }),
  outgoingRatings: many(rating, { relationName: "outgoingRatings" }),
  encounteredPlayersAsRatee: many(encounteredPlayer),
  notificationCourts: many(notificationCourt),
  primaryCourt: one(court, {
    fields: [user.primaryCourtId],
    references: [court.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const courtRelations = relations(court, ({ one, many }) => ({
  createdByUser: many(user),
  courtSessions: many(courtSession),
}));

export const courtSessionRelations = relations(
  courtSession,
  ({ one, many }) => ({
    user: one(user, {
      fields: [courtSession.userId],
      references: [user.id],
    }),
    court: one(court, {
      fields: [courtSession.courtId],
      references: [court.id],
    }),
    ratings: many(rating),
    encounteredPlayers: many(encounteredPlayer),
  }),
);

export const ratingRelations = relations(rating, ({ one, many }) => ({
  rater: one(user, {
    fields: [rating.raterId],
    references: [user.id],
    relationName: "outgoingRatings",
  }),
  ratee: one(user, {
    fields: [rating.rateeId],
    references: [user.id],
    relationName: "incomingRatings",
  }),
  raterCourtSession: one(courtSession, {
    fields: [rating.raterCourtSession],
    references: [courtSession.id],
  }),
}));

export const encounteredPlayerRelations = relations(
  encounteredPlayer,
  ({ one }) => ({
    courtSession: one(courtSession, {
      fields: [encounteredPlayer.courtSessionId],
      references: [courtSession.id],
    }),
    ratee: one(user, {
      fields: [encounteredPlayer.rateeId],
      references: [user.id],
    }),
  }),
);

export const activityRelations = relations(activity, ({ one }) => ({
  rating: one(rating, {
    fields: [activity.ratingId],
    references: [rating.id],
  }),
  courtSession: one(courtSession, {
    fields: [activity.courtSessionId],
    references: [courtSession.id],
  }),
  court: one(court, {
    fields: [activity.courtId],
    references: [court.id],
  }),
}));

export const notificationCourtRelations = relations(
  notificationCourt,
  ({ one }) => ({
    user: one(user, {
      fields: [notificationCourt.userId],
      references: [user.id],
    }),
    court: one(court, {
      fields: [notificationCourt.courtId],
      references: [court.id],
    }),
  }),
);
