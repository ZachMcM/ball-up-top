import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema";
import { invalidateQueriesForUsers } from "./invalidateQueries";

export async function invalidateHomeForCollege(
  collegeId: number,
): Promise<void> {
  const rows = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.primaryCollegeId, collegeId));

  const userIds = rows.map((r) => r.id);
  if (userIds.length > 0) {
    invalidateQueriesForUsers(userIds, ["home"]);
  }
}
