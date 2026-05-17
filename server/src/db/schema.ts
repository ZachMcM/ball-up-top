import { isNull } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
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

    primaryCollegeId: integer("primary_college_id").references(
      () => college.id,
    ),

    // archetype
    archetype: text().default("Prospect").notNull(),

    // extra attributes
    height: text(),

    onboardingStep: text("onboarding_step")
      .default("name")
      .notNull()
      .$type<"name" | "height" | "image" | "primaryCollege" | "socialContract" | "complete">(),

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

export const college = pgTable(
  "college",
  {
    id: serial().primaryKey().notNull(),
    name: text("name").notNull(),
    state: text("state").notNull(),
    city: text("city").notNull(),
    abbreviation: text().notNull(),
    primaryColor: text("primary_color").notNull(),
    secondaryColor: text("secondary_color").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("college_name_state_idx").on(table.name, table.state),
    index("college_state_city_idx").on(table.state, table.city),
  ],
);

export const court = pgTable(
  "court",
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    address: text("address").notNull(),

    collegeId: integer("college_id")
      .notNull()
      .references(() => college.id),

    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),

    image: text().notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("court_lat_lng_idx").on(table.lat, table.lng),
    index("court_college_id_idx").on(table.collegeId),
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
    index("rating_ratee_created_at_idx").on(table.rateeId, table.createdAt),
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

export const activity = pgTable(
  "activity",
  {
    id: serial().primaryKey().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id)
      .notNull(),
    type: text()
      .$type<"overall_change" | "rank_change" | "archetype_change">()
      .notNull(),

    ratingId: integer("rating_id").references(() => rating.id),
    rankChangeId: integer("rank_change_id"),

    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("activity_user_created_at_idx").on(
      table.userId,
      table.createdAt.desc(),
    ),
  ],
);

export const leaderboard = pgTable(
  "leaderboard",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    collegeId: integer("college_id")
      .notNull()
      .references(() => college.id),
    rank: integer("rank"),
    lastRatedAt: timestamp("last_rated_at"),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.collegeId] }),
    index("leaderboard_college_rank_idx").on(table.collegeId, table.rank),
    index("leaderboard_last_rated_idx").on(table.lastRatedAt),
  ],
);

export const rankChange = pgTable(
  "rank_change",
  {
    id: serial().primaryKey().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    collegeId: integer("college_id")
      .notNull()
      .references(() => college.id),
    raterCourtSessionId: integer("rater_court_session_id")
      .notNull()
      .references(() => courtSession.id),
    oldRank: integer("old_rank"),
    newRank: integer("new_rank").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("rank_change_user_id_idx").on(table.userId),
    index("rank_change_college_id_idx").on(table.collegeId),
    index("rank_change_rater_court_session_idx").on(table.raterCourtSessionId),
    index("rank_change_created_at_idx").on(table.createdAt),
    index("rank_change_user_college_created_at_idx").on(
      table.userId,
      table.collegeId,
      table.createdAt.desc(),
    ),
    index("rank_change_college_user_created_at_idx").on(
      table.collegeId,
      table.userId,
      table.createdAt.desc(),
    ),
  ],
);
