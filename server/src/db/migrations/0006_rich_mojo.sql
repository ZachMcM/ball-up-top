ALTER TABLE "court_session" ALTER COLUMN "has_rated" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "court_session" ALTER COLUMN "has_rated" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "one_active_session_per_user" ON "court_session" USING btree ("user_id") WHERE "court_session"."end_time" is null;