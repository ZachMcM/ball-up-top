import ActivityGraph from '@/components/ActivityGraph';
import { NativewindScrollView } from '@/components/NativewindScrollView';
import { useCourtSession } from '@/components/providers/CourtSessionProvider';
import { useLocation } from '@/components/providers/LocationProvider';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import UserItem from '@/components/UserItem';
import { useTabContext } from '@/hooks/useTabContext';
import { authClient } from '@/lib/auth-client';
import { deleteCourtNotification, getCourt, postCourtNotification } from '@/lib/endpoints';
import { THEME } from '@/lib/theme';
import { openDirections } from '@/lib/utils';
import { Court } from '@/types/court';
import { User } from '@/types/user';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  ArrowRight,
  ArrowRightIcon,
  BellIcon,
  ChevronRight,
  ClockIcon,
  HomeIcon,
  MapPinIcon,
  MapPinnedIcon,
  SunIcon,
  UsersIcon,
  XIcon,
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

  const router = useRouter();

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

  const {
    activeCourtSession,
    checkIn,
    checkOut,
    isCheckInPending,
    isCheckOutPending,
    unratedCourtSession,
  } = useCourtSession();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handlePresentModalDismissed = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.7} />
    ),
    []
  );

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
                <AspectRatio ratio={16 / 9} className="relative overflow-hidden rounded-2xl">
                  <Image
                    source={{
                      uri: court.image,
                    }}
                    style={{ width: '100%', height: '100%' }}
                    className="absolute inset-0 object-cover"
                  />
                </AspectRatio>
                <View className="flex flex-1 flex-col gap-2">
                  <Text className="flex-1 text-2xl font-bold">{court.name}</Text>
                  <View className="flex flex-row items-center gap-2">
                    <Badge variant="secondary" className="self-start">
                      <Icon size={12} as={court.indoor ? HomeIcon : SunIcon} />
                      <Text>{court.indoor ? 'Indoor' : 'Outdoor'}</Text>
                    </Badge>
                    <Text className="font-medium text-muted-foreground">
                      {court.distance.toFixed(1)} miles
                    </Text>
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
                <View className="flex flex-1 flex-col gap-4">
                  <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center gap-2">
                      {court.currentActiveSessions !== 0 && (
                        <View className="size-2 animate-pulse rounded-full bg-green-500" />
                      )}
                      <Text className="font-semibold">
                        {court.currentActiveSessions} Active Players
                      </Text>
                    </View>
                    {court.currentActiveSessions > court.currentActiveUsers.length && (
                      <Pressable
                        className="flex flex-row items-center gap-1"
                        onPress={() =>
                          router.push({
                            pathname: '/court/[courtId]/players',
                            params: { courtId },
                          })
                        }>
                        <Text className="text-sm font-medium text-muted-foreground">See All</Text>
                        <Icon as={ChevronRight} className="text-muted-foreground" size={16} />
                      </Pressable>
                    )}
                  </View>
                  {court.currentActiveSessions !== 0 ? (
                    <View className="flex flex-col gap-3">
                      {court.currentActiveUsers.map((user, i) => (
                        <UserItem key={i} user={user} />
                      ))}
                    </View>
                  ) : (
                    <Text className="text-center text-sm font-medium text-muted-foreground">
                      No active runs currently.
                    </Text>
                  )}
                  <Separator />
                </View>
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
                <View className="flex flex-1 flex-col gap-4">
                  <View className="flex flex-row items-center justify-between">
                    <Text className="font-semibold">Court Leaderboard</Text>
                    <Pressable
                      className="flex flex-row items-center gap-1"
                      onPress={() => {
                        router.push({
                          pathname: '/court/[courtId]/leaderboard',
                          params: { courtId },
                        });
                      }}>
                      <Text className="text-sm font-medium text-muted-foreground">See All</Text>
                      <Icon as={ChevronRight} className="text-muted-foreground" size={16} />
                    </Pressable>
                  </View>
                  {court.leaderboard.length !== 0 ? (
                    court.leaderboard.map((user) => (
                      <UserItem className="flex-1" user={user}>
                        <Text className="text-lg font-bold">#{user.rank}</Text>
                      </UserItem>
                    ))
                  ) : (
                    <Text className="text-center text-sm font-medium text-muted-foreground">
                      No court leaderboard data.
                    </Text>
                  )}
                </View>
              </>
            )
          )}
        </NativewindScrollView>
      </KeyboardAvoidingView>
      <BottomSheetModal
        key={`court-${courtId}-check-in-modal`}
        ref={bottomSheetModalRef}
        backdropComponent={renderBackdrop}
        containerStyle={{ marginHorizontal: 0, paddingHorizontal: 0 }}
        backgroundStyle={{
          backgroundColor: THEME[colorScheme!].background,
        }}
        handleIndicatorStyle={{ backgroundColor: THEME[colorScheme!].muted }}>
        <BottomSheetView className="flex flex-1 flex-col gap-3.5 px-4 py-8">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-2xl font-bold">Check In</Text>
            <Button
              onPress={handlePresentModalDismissed}
              className="size-7"
              size="icon"
              variant="outline">
              <Icon size={16} as={XIcon} />
            </Button>
          </View>
          <View className="flex flex-row items-center gap-4 rounded-2xl border border-border px-4 py-3">
            <AspectRatio ratio={1 / 1} className="relative h-[56px] overflow-hidden rounded-md">
              <Image
                source={{
                  uri: court?.image,
                }}
                style={{ width: '100%', height: '100%' }}
                className="absolute inset-0 object-cover"
              />
            </AspectRatio>
            <View className="flex flex-1 flex-col">
              <Text className="font-bold">{court?.name}</Text>
              <View className="flex flex-row items-center gap-1">
                <Icon className="text-muted-foreground" size={16} as={MapPinIcon} />
                <Text className="text-sm font-medium text-muted-foreground">
                  {court?.distance.toFixed(1)} mi
                </Text>
              </View>
            </View>
          </View>
          <View className="flex flex-col gap-3 rounded-2xl border border-border px-4 py-3">
            <View className="flex flex-row items-center gap-2">
              <Icon as={UsersIcon} className="text-muted-foreground" size={16} />
              <Text className="font-semibold">
                {court?.currentActiveSessions} Currently Playing
              </Text>
            </View>
            {court?.currentActiveSessions !== 0 && (
              <View className="flex flex-row flex-wrap gap-2">
                {court?.currentActiveUsers.map((user) => (
                  <View
                    key={user.id}
                    className="flex flex-row items-center gap-1.5 rounded-full bg-muted p-0.5 pr-2.5">
                    <Avatar
                      className="size-6"
                      alt={`${user.name}'s image`}
                      source={{ uri: user.image }}
                    />
                    <Text className="text-sm font-semibold">{user.name.split(' ')[0]}</Text>
                  </View>
                ))}
                {court?.currentActiveSessions! > court?.currentActiveUsers.length! && (
                  <Text className="text-sm font-medium text-muted-foreground">
                    +{court?.currentActiveSessions! - court?.currentActiveUsers.length!} more
                  </Text>
                )}
              </View>
            )}
          </View>
          <View className="flex flex-row items-center gap-1.5 rounded-2xl border border-border px-4 py-3">
            <Icon as={ClockIcon} className="text-muted-foreground" size={14} />
            <Text className="flex-1 text-sm font-medium text-muted-foreground">
              Your session timer will start when you check in.
            </Text>
          </View>
          <Button
            disabled={isCheckInPending || !!activeCourtSession || !!unratedCourtSession}
            onPress={() => checkIn(courtId)}
            size="lg"
            className="flex-1">
            <Text>Start Session</Text>
            {isCheckInPending && <ActivityIndicator />}
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
