import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  doublePrecision,
  integer,
  serial,
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

    // ratings
    overall: integer().default(60).notNull(),
    finishingRating: integer("finishing_rating").default(60).notNull(),
    playmakingRating: integer("playmaking_rating")
      .default(60)
      .notNull(),
    defenseRating: integer("defense_rating").default(60).notNull(),
    shootingRating: integer("shooting_rating").default(60).notNull(),

    // archetype
    archetype: text().default("Unranked").notNull(),

    // extra attributes
    height: text().notNull(),
  },
  (table) => [index("user_overall_idx").on(table.overall)]
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
  (table) => [index("session_userId_idx").on(table.userId)]
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
  (table) => [index("account_userId_idx").on(table.userId)]
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
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const court = pgTable(
  "court",
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    aliases: text().array().notNull().default([]),
    googlePlaceId: text("google_place_id").notNull().unique(),
    address: text("address").notNull(),

    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),

    indoor: boolean("indoor").notNull().default(false),
    verified: boolean("verified").notNull().default(false),

    photoUrl: text("photo_url"),

    createdByUserId: text("created_by_user_id").references(() => user.id),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("court_lat_lng_idx").on(table.lat, table.lng),
    index("court_verified_idx").on(table.verified),
    index("court_created_by_user_id_idx").on(table.createdByUserId),
  ]
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
    hasRated: boolean("has_rated"),
  },
  (table) => [
    index("court_session_user_id_idx").on(table.userId),
    index("court_session_court_id_idx").on(table.courtId),
    index("court_session_start_time_idx").on(table.startTime),
  ]
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

    raterCourtSession: integer("rater_court_session")
      .notNull()
      .references(() => courtSession.id),

    shootingRating: integer("shooting_rating").notNull(),
    defenseRating: integer("defense_rating").notNull(),
    playmakingRating: integer("playmaking_rating").notNull(),
    finishingRating: integer("finishing_rating").notNull(),

    raterOverallAtTime: integer("rater_overall_at_time").notNull(),
    runCompetitivenessAtTime: doublePrecision(
      "run_competitiveness_at_time"
    ).notNull(),
    finalWeightApplied: doublePrecision("final_weight_applied").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("rating_ratee_idx").on(table.rateeId),
    index("rating_rater_idx").on(table.raterId),
    index("rating_rater_court_session_idx").on(table.raterCourtSession),
    index("rating_created_at_idx").on(table.createdAt),
  ]
);
