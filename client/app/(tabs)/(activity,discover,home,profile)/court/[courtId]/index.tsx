import ActivityGraph from '@/components/ActivityGraph';
import CourtCheckInModal from '@/components/CourtCheckInModal';
import { CourtNameLabel } from '@/components/CourtNameLabel';
import { NativewindScrollView } from '@/components/NativewindScrollView';
import { ActivePlayersSection } from '@/components/court/ActivePlayersSection';
import { CourtLeaderboardSection } from '@/components/court/CourtLeaderboardSection';
import { useCourtSession } from '@/components/providers/CourtSessionProvider';
import { useLocation } from '@/components/providers/LocationProvider';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { deleteCourtNotification, getCourt, postCourtNotification } from '@/lib/endpoints';
import { THEME } from '@/lib/theme';
import { openDirections } from '@/lib/utils';
import { Court } from '@/types/court';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  HomeIcon,
  MapPinIcon,
  MapPinnedIcon,
  SunIcon,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useCallback, useRef } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { toast } from 'sonner-native';

export default function CourtPage() {
  const { location } = useLocation();
  const searchParams = useLocalSearchParams();
  const courtId = parseInt(searchParams.courtId as string);
  const queryClient = useQueryClient();

  const { data: court, isPending } = useQuery({
    queryFn: async () =>
      getCourt(courtId, {
        lat: location?.coords.latitude!,
        lng: location?.coords.longitude!,
      }),
    queryKey: ['court', courtId],
  });

  const { mutate: enableNotification } = useMutation({
    mutationFn: async () => postCourtNotification(courtId),
    onSuccess: () => {
      queryClient.setQueryData(['court', courtId], (old: Court) => ({
        ...old,
        isNotificationEnabled: true,
      }));
    },
    onError: (error) => {
      console.log('Error', error);
      toast.error(error.message);
    },
  });

  const { mutate: disableNotification } = useMutation({
    mutationFn: async () => deleteCourtNotification(courtId),
    onSuccess: () => {
      queryClient.setQueryData(['court', courtId], (old: Court) => ({
        ...old,
        isNotificationEnabled: false,
      }));
    },
    onError: (error) => {
      console.log('Error', error);
      toast.error(error.message);
    },
  });

  const toggleNotification = () => {
    if (court?.isNotificationEnabled) {
      disableNotification();
    } else {
      enableNotification();
    }
  };

  const { colorScheme } = useColorScheme();

  const { activeCourtSession, checkOut, isCheckInPending, isCheckOutPending, unratedCourtSession } =
    useCourtSession();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: court?.name ?? 'Court',
          headerRight: () => (
            <View className="flex-row gap-3">
              <Pressable onPress={toggleNotification}>
                <Icon
                  size={22}
                  fill={court?.isNotificationEnabled ? THEME[colorScheme!].primary : undefined}
                  as={BellIcon}
                />
              </Pressable>
            </View>
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <NativewindScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerClassName="flex w-full flex-col gap-8 px-4 py-6"
          keyboardShouldPersistTaps="handled">
          {isPending ? (
            <ActivityIndicator />
          ) : (
            court && (
              <>
                <AspectRatio ratio={2.5 / 1} className="relative overflow-hidden rounded-2xl">
                  <Image
                    source={{
                      uri: court.image,
                    }}
                    style={{ width: '100%', height: '100%' }}
                    className="absolute inset-0 object-cover"
                  />
                </AspectRatio>
                <View className="flex flex-1 flex-col gap-1">
                  <CourtNameLabel
                    collegeName={court.collegeName}
                    collegeColor={court.collegeColor}
                    courtName={court.name}
                    size="lg"
                  />
                  <View className="flex flex-row items-center gap-3">
                    <View className="flex flex-row items-center gap-1">
                      <Icon as={MapPinIcon} className="text-muted-foreground" size={16} />
                      <Text className="text-sm font-medium text-muted-foreground">
                        {court.distance.toFixed(1)} mi
                      </Text>
                    </View>
                    <View className="flex flex-row items-center gap-1">
                      <Icon
                        as={court.indoor ? HomeIcon : SunIcon}
                        className="text-muted-foreground"
                        size={16}
                      />
                      <Text className="text-sm font-medium text-muted-foreground">
                        {court.indoor ? 'Indoor' : 'Outdoor'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex w-full flex-1 flex-row items-center gap-2">
                  {activeCourtSession && activeCourtSession.courtId == court.id ? (
                    <Button
                      disabled={isCheckOutPending}
                      onPress={checkOut}
                      size="lg"
                      className="flex-1">
                      <Icon as={ArrowLeftIcon} className="text-primary-foreground" size={18} />
                      <Text>Check Out</Text>
                      {isCheckOutPending && <ActivityIndicator />}
                    </Button>
                  ) : (
                    <Button
                      disabled={isCheckInPending || !!activeCourtSession || !!unratedCourtSession}
                      onPress={handlePresentModalPress}
                      size="lg"
                      className="flex-1">
                      <Icon as={ArrowRightIcon} className="text-primary-foreground" size={18} />
                      <Text>Check In</Text>
                      {isCheckInPending && <ActivityIndicator />}
                    </Button>
                  )}
                  <Button
                    className="flex-1"
                    size="lg"
                    variant="outline"
                    onPress={() => openDirections(court.address)}>
                    <Icon as={MapPinnedIcon} size={18} />
                    <Text>Directions</Text>
                  </Button>
                </View>
                <ActivePlayersSection
                  courtId={court.id}
                  currentActiveSessions={court.currentActiveSessions}
                  currentActiveUsers={court.currentActiveUsers}
                />
                <Separator />
                <View className="flex flex-1 flex-col gap-4">
                  <Text className="font-semibold">Average Activity Stats</Text>
                  {court.activityGraph.filter((point) => point.avgSessions !== 0).length !== 0 ? (
                    <ActivityGraph height={56} points={court.activityGraph} />
                  ) : (
                    <Text className="text-center text-sm font-medium text-muted-foreground">
                      No activity data yet.
                    </Text>
                  )}
                  <Separator />
                </View>
                <CourtLeaderboardSection courtId={court.id} leaderboard={court.leaderboard} />
              </>
            )
          )}
        </NativewindScrollView>
      </KeyboardAvoidingView>
      {court && <CourtCheckInModal bottomSheetModalRef={bottomSheetModalRef} court={court} />}
    </>
  );
}
