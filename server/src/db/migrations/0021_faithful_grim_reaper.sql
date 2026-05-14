ALTER TABLE "activity" DROP CONSTRAINT "activity_court_session_id_court_session_id_fk";
--> statement-breakpoint
ALTER TABLE "activity" DROP COLUMN "court_session_id";