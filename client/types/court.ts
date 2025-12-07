import * as z from 'zod';

export type Place = z.infer<typeof PlaceSchema>;

export const PlaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  formattedAddress: z.string(),
});

export interface CourtListEntry {
  id: number;
  name: string;
  aliases: string[];
  googlePlaceId: string;
  address: string;
  lat: number;
  lng: number;
  indoor: boolean;
  verified: boolean;
  image: string;
  distance: number;
  avgPlayerOverall: number;
  currentActiveSessions: number;
  activityGraph: {
    hour: number;
    avgSessions: number;
  }[];
}
