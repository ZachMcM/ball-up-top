CREATE TABLE "leaderboard" (
	"user_id" text NOT NULL,
	"court_id" integer NOT NULL,
	"overall" integer NOT NULL,
	"rank" integer,
	"last_rated_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leaderboard_user_id_court_id_pk" PRIMARY KEY("user_id","court_id")
);
--> statement-breakpoint
ALTER TABLE "rating" ADD COLUMN "ratee_court_session" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_court_id_court_id_fk" FOREIGN KEY ("court_id") REFERENCES "public"."court"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "leaderboard_court_rank_idx" ON "leaderboard" USING btree ("court_id","rank");--> statement-breakpoint
CREATE INDEX "leaderboard_last_rated_idx" ON "leaderboard" USING btree ("last_rated_at");--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_ratee_court_session_court_session_id_fk" FOREIGN KEY ("ratee_court_session") REFERENCES "public"."court_session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "rating_ratee_court_session_idx" ON "rating" USING btree ("ratee_court_session");