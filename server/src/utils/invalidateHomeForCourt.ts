import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema";
import { invalidateQueriesForUsers } from "./invalidateQueries";

export async function invalidateHomeForCourt(courtId: number): Promise<void> {
  const rows = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.primaryCourtId, courtId));

  const userIds = rows.map((r) => r.id);
  if (userIds.length > 0) {
    invalidateQueriesForUsers(userIds, ["home"]);
  }
}
