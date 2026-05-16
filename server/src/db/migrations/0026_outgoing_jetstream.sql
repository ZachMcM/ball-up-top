ALTER TABLE "court" ALTER COLUMN "image" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "college" ADD COLUMN "abbreviation" text DEFAULT 'MSU' NOT NULL;