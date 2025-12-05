import { Router } from "express";
import { authMiddleware, upload } from "../../utils/middleware";
import { handleError } from "../../utils/handleError";
import * as z from "zod";
import { db } from "../db";
import { user } from "../db/schema";
import { r2 } from "../../utils/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";

export const usersRoute = Router();

usersRoute.patch(
  "/users/image",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          error:
            "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed",
        });
      }

      const fileName = `users/${
        res.locals.userId
      }-${Date.now()}.${file.originalname.split(".").pop()}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      const imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

      await db
        .update(user)
        .set({ image: imageUrl })
        .where(eq(user.id, res.locals.userId!));

      return res.json({ image: imageUrl });
    } catch (error) {
      handleError(error, res, "PATCH /users/image");
    }
  }
);
