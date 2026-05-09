ALTER TABLE "notification_court" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "notification_court" CASCADE;--> statement-breakpoint
ALTER TABLE "court" DROP CONSTRAINT "court_google_place_id_unique";--> statement-breakpoint
ALTER TABLE "court" DROP COLUMN "aliases";--> statement-breakpoint
ALTER TABLE "court" DROP COLUMN "google_place_id";