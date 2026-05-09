CREATE TABLE "rank_change" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"court_id" integer NOT NULL,
	"rater_court_session_id" integer NOT NULL,
	"old_rank" integer,
	"new_rank" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity" ADD COLUMN "rank_change_id" integer;--> statement-breakpoint
ALTER TABLE "rank_change" ADD CONSTRAINT "rank_change_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rank_change" ADD CONSTRAINT "rank_change_court_id_court_id_fk" FOREIGN KEY ("court_id") REFERENCES "public"."court"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rank_change" ADD CONSTRAINT "rank_change_rater_court_session_id_court_session_id_fk" FOREIGN KEY ("rater_court_session_id") REFERENCES "public"."court_session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "rank_change_user_id_idx" ON "rank_change" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "rank_change_court_id_idx" ON "rank_change" USING btree ("court_id");--> statement-breakpoint
CREATE INDEX "rank_change_rater_court_session_idx" ON "rank_change" USING btree ("rater_court_session_id");--> statement-breakpoint
CREATE INDEX "rank_change_created_at_idx" ON "rank_change" USING btree ("created_at");