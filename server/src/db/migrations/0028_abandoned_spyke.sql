CREATE INDEX "activity_user_created_at_idx" ON "activity" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "rank_change_user_college_created_at_idx" ON "rank_change" USING btree ("user_id","college_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "rank_change_college_user_created_at_idx" ON "rank_change" USING btree ("college_id","user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "rating_ratee_created_at_idx" ON "rating" USING btree ("ratee_id","created_at");