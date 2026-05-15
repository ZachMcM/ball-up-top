import { ActivePlayer } from './court';
import { College } from './college';

export type HomeCourt = {
  id: number;
  name: string;
  address: string;
  activePlayerCount: number;
  activePlayers: ActivePlayer[];
};

export type HomeResponse = {
  userData: {
    name: string;
    archetype: string;
    overall: number;
    rank: number | null;
    rankDelta: number | null;
  };
  primaryCollege: College;
  courts: HomeCourt[];
};
