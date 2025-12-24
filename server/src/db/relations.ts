import { relations } from "drizzle-orm";
import {
  account,
  court,
  courtBookmark,
  courtSession,
  rating,
  session,
  user,
} from "./schema";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  createdCourts: many(court),
  courtSessions: many(courtSession),
  incomingRatings: many(rating, { relationName: "incomingRatings" }),
  outgoingRatings: many(rating, { relationName: "outgoingRatings" }),
  courtBookmarks: many(courtBookmark),
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
  createdByUser: one(user, {
    fields: [court.createdByUserId],
    references: [user.id],
  }),
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
  })
);

export const ratingRelations = relations(rating, ({ one }) => ({
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

export const courtBookmarkRelations = relations(courtBookmark, ({ one }) => ({
  user: one(user, {
    fields: [courtBookmark.userId],
    references: [user.id],
  }),
  court: one(court, {
    fields: [courtBookmark.courtId],
    references: [court.id],
  }),
}));
