import { isNull } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/pg-core";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    phoneNumber: text("phone_number").unique(),
    phoneNumberVerified: boolean("phone_number_verified"),

    // ratings
    overall: integer().default(60).notNull(),
    finishingRating: integer("finishing_rating").default(60).notNull(),
    playmakingRating: integer("playmaking_rating").default(60).notNull(),
    defenseRating: integer("defense_rating").default(60).notNull(),
    shootingRating: integer("shooting_rating").default(60).notNull(),

    primaryCourtId: integer("primary_court_id").references(() => court.id),

    // archetype
    archetype: text().default("Unranked").notNull(),

    // extra attributes
    height: text(),

    onboardingStep: text("onboarding_step")
      .default("name")
      .notNull()
      .$type<"name" | "height" | "image" | "primaryCollege" | "complete">(),

    expoPushToken: text("expo_push_token"),
  },
  (table) => [index("user_overall_idx").on(table.overall)],
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const court = pgTable(
  "court",
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    aliases: text().array().notNull().default([]),
    googlePlaceId: text("google_place_id").notNull().unique(),
    address: text("address").notNull(),

    collegeName: text("college_name").notNull(),
    collegeColor: text("college_color").notNull(),

    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),

    indoor: boolean("indoor").notNull().default(false),

    image: text("image").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("court_lat_lng_idx").on(table.lat, table.lng),
    index("court_indoor_idx").on(table.indoor),
  ],
);

export const courtSession = pgTable(
  "court_session",
  {
    id: serial().primaryKey().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    courtId: integer("court_id")
      .notNull()
      .references(() => court.id),
    startTime: timestamp("start_time").defaultNow().notNull(),
    endTime: timestamp("end_time"),
    hasRated: boolean("has_rated").notNull().default(false),
  },
  (table) => [
    index("court_session_user_id_idx").on(table.userId),
    index("court_session_court_id_idx").on(table.courtId),
    index("court_session_start_time_idx").on(table.startTime),

    uniqueIndex("one_active_session_per_user")
      .on(table.userId)
      .where(isNull(table.endTime)),
  ],
);

export const rating = pgTable(
  "rating",
  {
    id: serial().primaryKey().notNull(),

    raterId: text("rater_id")
      .notNull()
      .references(() => user.id),
    rateeId: text("ratee_id")
      .notNull()
      .references(() => user.id),

    raterCourtSessionId: integer("rater_court_session")
      .notNull()
      .references(() => courtSession.id),
    rateeCourtSessionId: integer("ratee_court_session")
      .notNull()
      .references(() => courtSession.id),

    shootingRating: integer("shooting_rating").notNull(),
    defenseRating: integer("defense_rating").notNull(),
    playmakingRating: integer("playmaking_rating").notNull(),
    finishingRating: integer("finishing_rating").notNull(),

    raterOverallAtTime: integer("rater_overall_at_time").notNull(),

    runCompetitivenessAtTime: doublePrecision(
      "run_competitiveness_at_time",
    ).notNull(),

    finalWeightAppliedShooting: doublePrecision(
      "final_weight_applied_shooting",
    ).notNull(),
    finalWeightAppliedPlaymaking: doublePrecision(
      "final_weight_applied_playmaking",
    ).notNull(),
    finalWeightAppliedDefense: doublePrecision(
      "final_weight_applied_defense",
    ).notNull(),
    finalWeightAppliedFinishing: doublePrecision(
      "final_weight_applied_finishing",
    ).notNull(),

    rateeNewOverall: integer("ratee_new_overall").notNull(),
    rateeOldOverall: integer("ratee_old_overall").notNull(),

    rateeOldArchetype: text("ratee_old_archetype").notNull(),
    rateeNewArchetype: text("ratee_new_archetype").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("rating_ratee_idx").on(table.rateeId),
    index("rating_rater_idx").on(table.raterId),
    index("rating_rater_court_session_idx").on(table.raterCourtSessionId),
    index("rating_created_at_idx").on(table.createdAt),
    index("rating_ratee_court_session_idx").on(table.rateeCourtSessionId),
  ],
);

export const encounteredPlayer = pgTable(
  "encountered_player",
  {
    id: serial().primaryKey().notNull(),

    courtSessionId: integer("court_session_id")
      .notNull()
      .references(() => courtSession.id),
    rateeId: text("ratee_id")
      .notNull()
      .references(() => user.id),

    // === PRECOMPUTED AT CHECKOUT (immutable) ===

    // Combined weight (raterWeight × experienceWeight × runCompetitiveness × overlapWeight)
    // Does NOT include outlier weight (computed at submit time)
    combinedWeight: doublePrecision("combined_weight").notNull(),

    // For history/audit in rating table
    raterOverallAtTime: integer("rater_overall_at_time").notNull(),
    runCompetitivenessAtTime: doublePrecision(
      "run_competitiveness_at_time",
    ).notNull(),

    // Ratee's ratings at checkout (for outlier detection at submit time)
    rateeDefenseAtTime: integer("ratee_defense_at_time").notNull(),
    rateeFinishingAtTime: integer("ratee_finishing_at_time").notNull(),
    rateeShootingAtTime: integer("ratee_shooting_at_time").notNull(),
    rateePlaymakingAtTime: integer("ratee_playmaking_at_time").notNull(),
    rateeOverallAtTime: integer("ratee_overall_at_time").notNull(),
    rateeLifetimeCount: integer("ratee_lifetime_count").notNull(), // Count of ratings received, not sessions

    // Ratee display info (frozen for UI)
    rateeName: text("ratee_name").notNull(),
    rateeImage: text("ratee_image"),
    rateeArchetype: text("ratee_archetype").notNull(),
    rateeHeight: text("ratee_height"),

    // === DRAFT RATINGS (mutable) ===

    // User's rating inputs (nullable until rated)
    defenseRating: integer("defense_rating"),
    finishingRating: integer("finishing_rating"),
    shootingRating: integer("shooting_rating"),
    playmakingRating: integer("playmaking_rating"),

    // Skip tracking
    skipped: boolean("skipped").notNull().default(false),

    // Order in the form
    displayOrder: integer("display_order").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("encountered_player_court_session_idx").on(table.courtSessionId),
    uniqueIndex("encountered_player_court_session_ratee_idx").on(
      table.courtSessionId,
      table.rateeId,
    ),
  ],
);

export const activity = pgTable("activity", {
  id: serial().primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id)
    .notNull(),
  type: text()
    .$type<
      | "rating_received"
      | "session_completed"
      | "rating_milestone"
      | "archetype_changed"
      | "court_activity"
      | "rank_changed"
    >()
    .notNull(),

  ratingId: integer("rating_id").references(() => rating.id),
  courtSessionId: integer("court_session_id").references(() => courtSession.id),
  courtId: integer("court_id").references(() => court.id),

  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationCourt = pgTable(
  "notification_court",
  {
    id: serial().primaryKey().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    courtId: integer("court_id")
      .notNull()
      .references(() => court.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.courtId)],
);

export const leaderboard = pgTable(
  "leaderboard",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    courtId: integer("court_id")
      .notNull()
      .references(() => court.id),
    overall: integer("overall").notNull(),
    rank: integer("rank"),
    lastRatedAt: timestamp("last_rated_at").notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.courtId] }),
    index("leaderboard_court_rank_idx").on(table.courtId, table.rank),
    index("leaderboard_last_rated_idx").on(table.lastRatedAt),
  ],
);
