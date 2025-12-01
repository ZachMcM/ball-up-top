import { Router } from "express";
import { authMiddleware } from "../../utils/middleware";
import { handleError } from "../../utils/handleError";
import { db } from "../db";
import { courtSession } from "../db/schema";

export const courts = Router();

courts.post("/courts/:courtId/sessions", authMiddleware, async (req, res) => {
  try {
    const courtId = parseInt(req.params.courtId);

    if (!Number.isInteger(courtId)) {
      return res.status(400).json({ error: "Court ID is not an integer." });
    }

    await db.insert(courtSession).values({
      userId: res.locals.userId!,
      courtId,
    });

    res.json({ success: true })
  } catch (error) {
    handleError(error, res, "POST /courts/:courtId/sessions");
  }
});

