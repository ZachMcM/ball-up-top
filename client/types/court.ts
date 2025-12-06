export interface Court {
  id: number;
  name: string;
  aliases: string[];
  googlePlaceId: string;
  address: string;
  lat: number;
  lng: number;
  indoor: boolean;
  verified: boolean;
  photoUrl: string;
  distance: number;
}
