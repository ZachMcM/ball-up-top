CREATE TABLE "college" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"state" text NOT NULL,
	"city" text NOT NULL,
	"primary_color" text NOT NULL,
	"secondary_color" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity" DROP CONSTRAINT "activity_court_id_court_id_fk";
--> statement-breakpoint
ALTER TABLE "leaderboard" DROP CONSTRAINT "leaderboard_court_id_court_id_fk";
--> statement-breakpoint
ALTER TABLE "rank_change" DROP CONSTRAINT "rank_change_court_id_court_id_fk";
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_primary_court_id_court_id_fk";
--> statement-breakpoint
DROP INDEX "leaderboard_court_rank_idx";--> statement-breakpoint
DROP INDEX "rank_change_court_id_idx";--> statement-breakpoint
ALTER TABLE "leaderboard" DROP CONSTRAINT "leaderboard_user_id_court_id_pk";--> statement-breakpoint
ALTER TABLE "court" ADD COLUMN "college_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "college_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_user_id_college_id_pk" PRIMARY KEY("user_id","college_id");--> statement-breakpoint
ALTER TABLE "rank_change" ADD COLUMN "college_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "primary_college_id" integer;--> statement-breakpoint
CREATE UNIQUE INDEX "college_name_state_idx" ON "college" USING btree ("name","state");--> statement-breakpoint
CREATE INDEX "college_state_city_idx" ON "college" USING btree ("state","city");--> statement-breakpoint
ALTER TABLE "court" ADD CONSTRAINT "court_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rank_change" ADD CONSTRAINT "rank_change_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_primary_college_id_college_id_fk" FOREIGN KEY ("primary_college_id") REFERENCES "public"."college"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "court_college_id_idx" ON "court" USING btree ("college_id");--> statement-breakpoint
CREATE INDEX "leaderboard_college_rank_idx" ON "leaderboard" USING btree ("college_id","rank");--> statement-breakpoint
CREATE INDEX "rank_change_college_id_idx" ON "rank_change" USING btree ("college_id");--> statement-breakpoint
ALTER TABLE "activity" DROP COLUMN "court_id";--> statement-breakpoint
ALTER TABLE "court" DROP COLUMN "college_name";--> statement-breakpoint
ALTER TABLE "court" DROP COLUMN "college_color";--> statement-breakpoint
ALTER TABLE "leaderboard" DROP COLUMN "court_id";--> statement-breakpoint
ALTER TABLE "rank_change" DROP COLUMN "court_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "primary_court_id";