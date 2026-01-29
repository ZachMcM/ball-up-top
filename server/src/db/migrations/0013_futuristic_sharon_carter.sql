CREATE TABLE "notification_court" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"court_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notification_court_user_id_court_id_unique" UNIQUE("user_id","court_id")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "expo_push_token" text;--> statement-breakpoint
ALTER TABLE "notification_court" ADD CONSTRAINT "notification_court_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_court" ADD CONSTRAINT "notification_court_court_id_court_id_fk" FOREIGN KEY ("court_id") REFERENCES "public"."court"("id") ON DELETE no action ON UPDATE no action;