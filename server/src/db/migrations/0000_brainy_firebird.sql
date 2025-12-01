CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "court" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"aliases" text[] DEFAULT '{}' NOT NULL,
	"google_place_id" text NOT NULL,
	"address" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"indoor" boolean DEFAULT false NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"photo_url" text,
	"created_by_user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "court_google_place_id_unique" UNIQUE("google_place_id")
);
--> statement-breakpoint
CREATE TABLE "court_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"court_id" integer NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp,
	"has_rated" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "rating" (
	"id" serial PRIMARY KEY NOT NULL,
	"rater_id" text NOT NULL,
	"ratee_id" text NOT NULL,
	"rater_court_session" integer NOT NULL,
	"shooting_rating" double precision NOT NULL,
	"defense_rating" double precision NOT NULL,
	"playmaking_rating" double precision NOT NULL,
	"finishing_rating" double precision NOT NULL,
	"rater_overall_at_time" double precision NOT NULL,
	"run_competitiveness_at_time" double precision NOT NULL,
	"final_weight_applied" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"overall" double precision DEFAULT 60 NOT NULL,
	"finishing_rating" double precision DEFAULT 60 NOT NULL,
	"playmaking_rating" double precision DEFAULT 60 NOT NULL,
	"defense_rating" double precision DEFAULT 60 NOT NULL,
	"shooting_rating" double precision DEFAULT 60 NOT NULL,
	"archetype" text DEFAULT 'Unranked' NOT NULL,
	"height" text NOT NULL,
	"weight" integer NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "court" ADD CONSTRAINT "court_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "court_session" ADD CONSTRAINT "court_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "court_session" ADD CONSTRAINT "court_session_court_id_court_id_fk" FOREIGN KEY ("court_id") REFERENCES "public"."court"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_rater_id_user_id_fk" FOREIGN KEY ("rater_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_ratee_id_user_id_fk" FOREIGN KEY ("ratee_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_rater_court_session_court_session_id_fk" FOREIGN KEY ("rater_court_session") REFERENCES "public"."court_session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "court_lat_lng_idx" ON "court" USING btree ("lat","lng");--> statement-breakpoint
CREATE INDEX "court_verified_idx" ON "court" USING btree ("verified");--> statement-breakpoint
CREATE INDEX "court_created_by_user_id_idx" ON "court" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "court_session_user_id_idx" ON "court_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "court_session_court_id_idx" ON "court_session" USING btree ("court_id");--> statement-breakpoint
CREATE INDEX "court_session_start_time_idx" ON "court_session" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX "rating_ratee_idx" ON "rating" USING btree ("ratee_id");--> statement-breakpoint
CREATE INDEX "rating_rater_idx" ON "rating" USING btree ("rater_id");--> statement-breakpoint
CREATE INDEX "rating_rater_court_session_idx" ON "rating" USING btree ("rater_court_session");--> statement-breakpoint
CREATE INDEX "rating_created_at_idx" ON "rating" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_overall_idx" ON "user" USING btree ("overall");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");