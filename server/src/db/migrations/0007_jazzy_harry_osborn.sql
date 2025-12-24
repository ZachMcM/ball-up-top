CREATE TABLE "court_bookmark" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"court_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "court_bookmark" ADD CONSTRAINT "court_bookmark_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "court_bookmark" ADD CONSTRAINT "court_bookmark_court_id_court_id_fk" FOREIGN KEY ("court_id") REFERENCES "public"."court"("id") ON DELETE no action ON UPDATE no action;