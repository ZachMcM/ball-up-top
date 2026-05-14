import { getCourt, getCourtSessions, patchCourtSession, postCourtSession } from '@/lib/endpoints';
import { getDistanceInMiles } from '@/lib/utils';
import { CourtSession } from '@/types/court';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OctagonPauseIcon } from 'lucide-react-native';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { toast } from 'sonner-native';
import { Icon } from '../ui/icon';
import { Text } from '../ui/text';
import { useLocation } from './LocationProvider';

export const MAX_DISTANCE_FOR_CHECK_IN = 0.12; // miles (~100 meters)

type CourtSessionContextValues = {
  activeCourtSession?: CourtSession | null;
  isActiveCourtSessionPending: boolean;
  unratedCourtSession?: CourtSession | null;
  areUnratedCourtSessionPending: boolean;
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
    queryFn: async () => await getCourtSessions({ isActive: true }),
  });

  const { data: court } = useQuery({
    queryFn: async () => getCourt(activeCourtSession?.courtId!),
    queryKey: ['court', activeCourtSession?.courtId!],
    enabled: !!activeCourtSession?.courtId,
  });

  const { data: unratedCourtSession, isPending: areUnratedCourtSessionPending } = useQuery({
    queryKey: ['courtSession', 'unrated'],
    queryFn: async () => await getCourtSessions({ isActive: false, hasRated: false }),
  });

  useEffect(() => {
    if (activeCourtSession && court && location) {
      const distance = getDistanceInMiles(
        location.coords.latitude!,
        location.coords.longitude!,
        court.lat!,
        court.lng!
      );

      if (distance > MAX_DISTANCE_FOR_CHECK_IN) {
        checkOut();
        toast.error('You have been checked out of your current session due to distance.', {
          position: 'bottom-center',
        });
      }
    }
  }, [location, activeCourtSession, court]);

  const { dismiss, dismissAll } = useBottomSheetModal();

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
      queryClient.invalidateQueries({
        queryKey: ['courts'],
      });
      dismissAll();
      dismiss(`court-${courtId}-check-in-modal`);
      toast.success('Successfully checked in.', { position: 'bottom-center' });
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
      queryClient.setQueryData(['courtSession', 'isActive'], null);
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
      queryClient.invalidateQueries({
        queryKey: ['courts'],
      });
      toast.success('Successfully checked out.', { position: 'bottom-center' });
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
        unratedCourtSession,
        areUnratedCourtSessionPending,
      }}>
      {children}
    </CourtSessionContext.Provider>
  );
}

export function useCourtSession() {
  return useContext(CourtSessionContext) as CourtSessionContextValues;
}

function formatDuration(startTime: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - startTime.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function SessionFooter() {
  const { activeCourtSession, checkOut, isCheckOutPending } = useCourtSession();
  const [duration, setDuration] = useState('0:00');

  const { data: court } = useQuery({
    queryFn: async () => getCourt(activeCourtSession?.courtId!),
    queryKey: ['court', activeCourtSession?.courtId],
    enabled: !!activeCourtSession?.courtId,
  });

  useEffect(() => {
    if (!activeCourtSession?.startTime) return;

    const startTime = new Date(activeCourtSession.startTime);
    setDuration(formatDuration(startTime));

    const interval = setInterval(() => {
      setDuration(formatDuration(startTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCourtSession?.startTime]);

  if (!activeCourtSession) {
    return null;
  }

  return (
    <View className="border-t border-border bg-card px-4 py-3">
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-3">
          <View
            className="size-2.5 rounded-full bg-green-400"
            style={{
              shadowColor: '#4ade80',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 6,
            }}
          />
          <View className="flex flex-col">
            <View className="flex flex-row items-baseline gap-2">
              <Text
                className="text-xl tabular-nums text-foreground"
                style={{ fontFamily: 'BebasNeue_400Regular' }}>
                {duration}
              </Text>
              <Text className="text-xs text-muted-foreground">Elapsed</Text>
            </View>
            <Text className="text-xs text-muted-foreground">
              Live at {court?.name ?? 'Loading...'}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={checkOut}
          className="flex flex-row items-center gap-1.5"
          disabled={isCheckOutPending}>
          <Text className="text-sm font-semibold">End</Text>
          {isCheckOutPending ? (
            <ActivityIndicator size="small" className='text-muted-foreground' />
          ) : (
            <Icon as={OctagonPauseIcon} size={16} />
          )}
        </Pressable>
      </View>
    </View>
  );
}
