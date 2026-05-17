ALTER TABLE "rating" ADD COLUMN "anonymous_rater_at_time" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "anonymous_rater" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "anonymous_rater_updated_at" timestamp;