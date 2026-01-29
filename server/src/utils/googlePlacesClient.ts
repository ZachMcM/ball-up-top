import { PlacesClient } from "@googlemaps/places";

export const googlePlacesClient = new PlacesClient({
  apiKey: process.env.GOOGLE_MAPS_API_KEY
})