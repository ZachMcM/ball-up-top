import { getCourtSessions, patchCourtSession, postCourtSession } from '@/lib/endpoints';
import { CourtSession } from '@/types/court';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext } from 'react';
import { toast } from 'sonner-native';
import { useLocation } from './LocationProvider';

type CourtSessionContextValues = {
  activeCourtSession?: CourtSession | null;
  isActiveCourtSessionPending: boolean;
  unratedCourtSessions?: CourtSession[];
  areUnratedCourtSessionsPending: boolean;
  checkOut: () => void;
  isCheckOutPending: boolean;
  checkIn: (courtId: number) => void;
  isCheckInPending: boolean;
};

const CourtSessionContext = createContext<null | CourtSessionContextValues>(null);

export function CourtSessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { location } = useLocation();

  const { data: activeCourtSession, isPending: isActiveCourtSessionPending } = useQuery({
    queryKey: ['courtSession', 'isActive'],
    queryFn: async () => {
      const [courtSession] = await getCourtSessions({ isActive: true });
      return courtSession ?? null;
    },
  });

  const { data: unratedCourtSessions, isPending: areUnratedCourtSessionsPending } = useQuery({
    queryKey: ['courtSession', 'unrated'],
    queryFn: async () => await getCourtSessions({ isActive: false, hasRated: false }),
  });

  const { mutate: checkIn, isPending: isCheckInPending } = useMutation({
    mutationFn: async (id: number) => {
      await postCourtSession(id, {
        lat: location?.coords.latitude!,
        lng: location?.coords.longitude!,
      });
      return id;
    },
    onError: (error) => {
      console.log('Error', error);
      (toast.error(error.message), { position: 'bottom-center' });
    },
    onSuccess: (courtId) => {
      queryClient.invalidateQueries({
        queryKey: ['court', courtId],
      });
      queryClient.invalidateQueries({ queryKey: ['court', courtId, 'active-players'] });
      queryClient.invalidateQueries({
        queryKey: ['courtSession', 'isActive'],
      });
      queryClient.invalidateQueries({
        queryKey: ['courtSession', 'unrated'],
      });
      toast.success('Successfully checked in.');
    },
  });

  const { mutate: checkOut, isPending: isCheckOutPending } = useMutation({
    mutationFn: async () => {
      await patchCourtSession(activeCourtSession?.id!);
      return activeCourtSession?.courtId!;
    },
    onError: (error) => {
      console.log('Error', error);
      (toast.error(error.message), { position: 'bottom-center' });
    },
    onSuccess: (courtId) => {
      queryClient.invalidateQueries({
        queryKey: ['court', courtId],
      });
      queryClient.invalidateQueries({ queryKey: ['court', courtId, 'active-players'] });
      queryClient.invalidateQueries({
        queryKey: ['courtSession', 'isActive'],
      });
      queryClient.invalidateQueries({
        queryKey: ['courtSession', 'unrated'],
      });
      toast.success('Successfully checked out.');
    },
  });

  return (
    <CourtSessionContext.Provider
      value={{
        checkOut,
        checkIn,
        isCheckInPending,
        isCheckOutPending,
        activeCourtSession,
        isActiveCourtSessionPending,
        unratedCourtSessions,
        areUnratedCourtSessionsPending,
      }}>
      {children}
    </CourtSessionContext.Provider>
  );
}

export function useCourtSession() {
  return useContext(CourtSessionContext) as CourtSessionContextValues;
}