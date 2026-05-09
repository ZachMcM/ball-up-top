import { User } from './user';

export type CollegeOption = {
  courtId: number;
  collegeName: string;
  collegeColor: string;
};

export type CourtSession = {
  id: number;
  userId: string;
  courtId: number;
  startTime: Date;
  endTime: Date | null;
  hasRated: boolean;
};
