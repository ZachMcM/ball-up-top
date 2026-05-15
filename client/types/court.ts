export type CourtSession = {
  id: number;
  userId: string;
  courtId: number;
  startTime: Date;
  endTime: Date | null;
  hasRated: boolean;
};

export type CourtResponse = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export type ActivePlayer = {
  id: string;
  name: string;
  overall: number;
  archetype: string;
  image: string | null;
};

export type CourtActivePlayersResponse = {
  court: CourtResponse;
  activePlayers: ActivePlayer[];
};
