import { Router } from "express";
import * as z from "zod";
import { googlePlacesClient } from "../../utils/googlePlacesClient";
import { handleError } from "../../utils/handleError";
import { authMiddleware } from "../../utils/middleware";
import { MAX_RESULTS } from "../config/places";
import { db } from "../db";
import { inArray } from "drizzle-orm";
import { court } from "../db/schema";

export const placesRoute = Router();

const PlacesParamsSchema = z.object({
  searchQuery: z.string(),
});

placesRoute.get("/places", authMiddleware, async (req, res) => {
  try {
    const validQueryParams = PlacesParamsSchema.safeParse(req.query);
    if (!validQueryParams.success) {
      return res.status(400).json({ error: validQueryParams.error.message });
    }

    const { searchQuery: textQuery } = validQueryParams.data;

    const [response] = await googlePlacesClient.searchText(
      {
        textQuery,
        regionCode: "us",
        maxResultCount: MAX_RESULTS,
        languageCode: "en-US",
      },
      {
        otherArgs: {
          headers: {
            "X-Goog-FieldMask":
              "places.displayName,places.id,places.formattedAddress,places.location,places.types",
          },
        },
      }
    );

    const places = (response?.places || []).map((p) =>
      p.name?.trim() === "" ? { ...p, name: p.displayName?.text } : p
    );

    const preexistingPlaceIds = (
      await db.query.court.findMany({
        where: inArray(
          court.googlePlaceId,
          places.map((p) => p.id!)
        ),
        columns: {
          googlePlaceId: true,
        },
      })
    ).map((c) => c.googlePlaceId);

    const unclaimedPlaces = places.filter(
      (p) => !preexistingPlaceIds.includes(p.id!)
    );

    return res.json(unclaimedPlaces);
  } catch (error) {
    handleError(error, res, "GET /places");
  }
});
