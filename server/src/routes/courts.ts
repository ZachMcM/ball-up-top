import { Router } from "express";
import { authMiddleware } from "../../utils/middleware";
import { handleError } from "../../utils/handleError";
import { db } from "../db";
import { courtSession } from "../db/schema";

export const courts = Router();

courts.post("/courts/:courtId/sessions", authMiddleware, async (req, res) => {
  try {
    const courtId = parseInt(req.params.courtId);

    if (isNaN(courtId)) {
      return res.status(400).json({ error: "Invalid courtId, isNaN" });
    }

    await db.insert(courtSession).values({
      userId: res.locals.userId!,
      courtId,
    });
  } catch (error) {
    handleError(error, res, "/courts/:courtId/sessions");
  }
});

