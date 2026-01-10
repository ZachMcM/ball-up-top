CREATE TABLE "activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"rating_id" integer,
	"court_session_id" integer,
	"court_id" integer,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rating" ADD COLUMN "ratee_old_overall" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rating" ADD COLUMN "ratee_old_archetype" text NOT NULL;--> statement-breakpoint
ALTER TABLE "rating" ADD COLUMN "ratee_new_archetype" text NOT NULL;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_rating_id_rating_id_fk" FOREIGN KEY ("rating_id") REFERENCES "public"."rating"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_court_session_id_court_session_id_fk" FOREIGN KEY ("court_session_id") REFERENCES "public"."court_session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_court_id_court_id_fk" FOREIGN KEY ("court_id") REFERENCES "public"."court"("id") ON DELETE no action ON UPDATE no action;