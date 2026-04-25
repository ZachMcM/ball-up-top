ALTER TABLE "court_bookmark" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "court_bookmark" CASCADE;--> statement-breakpoint
DROP INDEX "court_verified_idx";--> statement-breakpoint
ALTER TABLE "court" DROP COLUMN "verified";