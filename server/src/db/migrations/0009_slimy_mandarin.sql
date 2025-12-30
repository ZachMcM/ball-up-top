CREATE TABLE "encountered_player" (
	"id" serial PRIMARY KEY NOT NULL,
	"court_session_id" integer NOT NULL,
	"ratee_id" text NOT NULL,
	"combined_weight" double precision NOT NULL,
	"rater_overall_at_time" integer NOT NULL,
	"run_competitiveness_at_time" double precision NOT NULL,
	"ratee_defense_at_time" integer NOT NULL,
	"ratee_finishing_at_time" integer NOT NULL,
	"ratee_shooting_at_time" integer NOT NULL,
	"ratee_playmaking_at_time" integer NOT NULL,
	"ratee_overall_at_time" integer NOT NULL,
	"ratee_lifetime_count" integer NOT NULL,
	"ratee_name" text NOT NULL,
	"ratee_image" text,
	"ratee_archetype" text NOT NULL,
	"ratee_height" text,
	"defense_rating" integer,
	"finishing_rating" integer,
	"shooting_rating" integer,
	"playmaking_rating" integer,
	"skipped" boolean DEFAULT false NOT NULL,
	"display_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "encountered_player" ADD CONSTRAINT "encountered_player_court_session_id_court_session_id_fk" FOREIGN KEY ("court_session_id") REFERENCES "public"."court_session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encountered_player" ADD CONSTRAINT "encountered_player_ratee_id_user_id_fk" FOREIGN KEY ("ratee_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "encountered_player_court_session_idx" ON "encountered_player" USING btree ("court_session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "encountered_player_court_session_ratee_idx" ON "encountered_player" USING btree ("court_session_id","ratee_id");