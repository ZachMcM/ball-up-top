ALTER TABLE "court" DROP CONSTRAINT "court_created_by_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "court_created_by_user_id_idx";--> statement-breakpoint
ALTER TABLE "court" ADD COLUMN "college_name" text DEFAULT 'Purdue University' NOT NULL;--> statement-breakpoint
ALTER TABLE "court" ADD COLUMN "college_color" text DEFAULT '#cfb991' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "primary_court_id" integer;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_primary_court_id_court_id_fk" FOREIGN KEY ("primary_court_id") REFERENCES "public"."court"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "court" DROP COLUMN "created_by_user_id";