import ActivityGraph from '@/components/ActivityGraph';
import { NativewindScrollView } from '@/components/NativewindScrollView';
import { useCourtSession } from '@/components/providers/CourtSessionProvider';
import { useLocation } from '@/components/providers/LocationProvider';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import UserCard from '@/components/UserCard';
import { deleteCourtBookmark, getCourt, postCourtBookmark } from '@/lib/endpoints';
import { THEME } from '@/lib/theme';
import { getInitials, openDirections } from '@/lib/utils';
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
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowRight,
  BookmarkIcon,
  ClockIcon,
  HouseIcon,
  MapPinIcon,
  SunIcon,
  TrophyIcon,
  UsersIcon,
  VerifiedIcon,
  XIcon,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { toast } from 'sonner-native';

export default function CourtPage() {
  const { location } = useLocation();
  const searchParams = useLocalSearchParams();
  const courtId = parseInt(searchParams.courtId as string);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['courtSession', 'isActive'] });
    await queryClient.invalidateQueries({ queryKey: ['courtSession', 'unrated'] });
    await queryClient.invalidateQueries({ queryKey: ['court', courtId] });
    await queryClient.invalidateQueries({ queryKey: ['court', courtId, 'active-players'] });
    setRefreshing(false);
  };

  const router = useRouter();

  const { data: court, isPending } = useQuery({
    queryFn: async () =>
      getCourt(courtId, {
        lat: location?.coords.latitude!,
        lng: location?.coords.longitude!,
      }),
    queryKey: ['court', courtId],
  });

  const { mutate: bookmarkCourt } = useMutation({
    mutationFn: async () => postCourtBookmark(courtId),
    onSuccess: () => {
      queryClient.setQueryData(['court', courtId], (old: Court) => ({
        ...old,
        isBookmarked: true,
      }));
    },
    onError: (error) => {
      console.log('Error', error);
      (toast.error(error.message), { position: 'bottom-center' });
    },
  });

  const { mutate: unbookmarkCourt } = useMutation({
    mutationFn: async () => deleteCourtBookmark(courtId),
    onSuccess: () => {
      queryClient.setQueryData(['court', courtId], (old: Court) => ({
        ...old,
        isBookmarked: false,
      }));
    },
    onError: (error) => {
      console.log('Error', error);
      (toast.error(error.message), { position: 'bottom-center' });
    },
  });

  const toggleBookmark = () => {
    if (court?.isBookmarked) {
      unbookmarkCourt();
    } else {
      bookmarkCourt();
    }
    queryClient.invalidateQueries({
      queryKey: ['courts'],
    });
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
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <NativewindScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerClassName="flex w-full flex-col gap-4 px-4 py-6"
          keyboardShouldPersistTaps="handled">
          {isPending ? (
            <ActivityIndicator />
          ) : (
            court && (
              <>
                <AspectRatio ratio={3 / 1} className="relative overflow-hidden rounded-xl">
                  <Image
                    source={{
                      uri: court.image,
                    }}
                    style={{ width: '100%', height: '100%' }}
                    className="absolute inset-0 object-cover"
                  />
                </AspectRatio>
                <View className="flex flex-col gap-1">
                  <View className="flex flex-row items-center justify-between">
                    <Text className="text-2xl font-bold">{court.name}</Text>
                    <View className="flex flex-row items-center gap-1.5">
                      <Button
                        onPress={toggleBookmark}
                        variant="outline"
                        size="icon"
                        className="size-7">
                        <Icon
                          fill={court.isBookmarked ? THEME[colorScheme!].primary : undefined}
                          as={BookmarkIcon}
                        />
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" className="size-7" size="icon">
                            <Icon as={court.indoor ? HouseIcon : SunIcon} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <Text>Court is {court.indoor ? 'indoor' : 'outdoor'}.</Text>
                        </TooltipContent>
                      </Tooltip>
                      {court.verified && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button className="size-7" size="icon">
                              <Icon as={VerifiedIcon} className="text-primary-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <Text>Court is verified.</Text>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </View>
                  </View>
                  <Pressable onPress={() => openDirections(court.address)}>
                    <Text className="font-medium text-muted-foreground">{court.address}</Text>
                  </Pressable>
                  <View className="flex flex-row items-center gap-1">
                    <Icon className="text-muted-foreground" size={16} as={MapPinIcon} />
                    <Text className="text-sm font-medium text-muted-foreground">
                      {court.distance.toFixed(1)} mi
                    </Text>
                  </View>
                </View>
                {activeCourtSession && activeCourtSession.courtId == court.id ? (
                  <Button
                    disabled={isCheckOutPending}
                    onPress={checkOut}
                    size="lg"
                    className="flex-1">
                    <Text>Check Out</Text>
                    {isCheckOutPending && <ActivityIndicator />}
                  </Button>
                ) : (
                  <Button
                    disabled={isCheckInPending || !!activeCourtSession || !!unratedCourtSession}
                    onPress={handlePresentModalPress}
                    size="lg"
                    className="flex-1">
                    <Text>Check In</Text>
                    {isCheckInPending && <ActivityIndicator />}
                  </Button>
                )}
                <View className="flex flex-1 flex-col gap-4 rounded-xl border border-border p-4">
                  <View className="flex flex-row items-center gap-1.5">
                    <Icon className="text-muted-foreground" size={16} as={ClockIcon} />
                    <Text className="font-semibold">Activity</Text>
                  </View>
                  <ActivityGraph points={court.activityGraph} />
                </View>
                <View className="flex flex-1 flex-col gap-4 rounded-xl border border-border p-4">
                  <View className="flex flex-row items-center gap-1.5">
                    <Icon className="text-muted-foreground" size={16} as={TrophyIcon} />
                    <Text className="font-semibold">Court Leaders</Text>
                  </View>
                  {court.leaderboard.length == 0 ? (
                    <Text className="text-center text-xs font-medium">No data yet.</Text>
                  ) : (
                    <NativewindScrollView
                      contentContainerClassName="flex flex-row items-center gap-4"
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      {court.leaderboard.map((user, i) => (
                        <LeaderboardCard key={i} user={user} index={i} />
                      ))}
                    </NativewindScrollView>
                  )}
                </View>
                <View className="flex flex-1 flex-col gap-4 rounded-xl border border-border p-4">
                  <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center gap-1.5">
                      <Icon as={UsersIcon} className="text-muted-foreground" size={16} />
                      <Text className="font-semibold">{court.currentActiveSessions} Playing</Text>
                    </View>
                    {court.currentActiveSessions !== 0 && (
                      <View className="flex flex-row items-center gap-1.5">
                        <View className="flex size-8 items-center justify-center rounded-full border border-border bg-muted/30">
                          <Text className="text-sm font-bold">{court.avgPlayerOverall}</Text>
                        </View>
                        <Text className="font-semibold">Average OVR</Text>
                      </View>
                    )}
                  </View>
                  {court.currentActiveSessions == 0 ? (
                    <Text className="text-center text-xs font-medium">No data yet.</Text>
                  ) : (
                    <View className="flex flex-col gap-6">
                      {court.currentActiveUsers.map((user, i) => (
                        <UserCard key={i} user={user} />
                      ))}
                      {court.currentActiveSessions > court.currentActiveUsers.length && (
                        <>
                          <Text className="text-sm text-muted-foreground">
                            +{court.currentActiveSessions - court.currentActiveUsers.length} more
                          </Text>
                          <Button
                            onPress={() => {
                              router.navigate({
                                pathname: '/(tabs)/(courts)/court/[courtId]/players',
                                params: { courtId },
                              });
                            }}
                            size="sm"
                            variant="outline"
                            className="self-start">
                            <Text>View All</Text>
                            <Icon as={ArrowRight} className="text-secondary-foreground" />
                          </Button>
                        </>
                      )}
                    </View>
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
        <BottomSheetView className="flex flex-1 flex-col gap-3.5 px-4 py-6">
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
            <View className="flex flex-col">
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
              <Icon as={UsersIcon} className="text-muted-foreground" size={18} />
              <Text className="font-semibold">{court?.currentActiveSessions} Current Playing</Text>
            </View>
            {court?.currentActiveSessions !== 0 && (
              <View className="flex flex-row flex-wrap">
                {court?.currentActiveUsers.map((user) => (
                  <View
                    key={user.id}
                    className="flex flex-row items-center gap-1.5 rounded-full border border-border bg-muted/30 p-0.5 pr-2.5">
                    <Avatar className="size-6" alt={`${user.name}'s image`}>
                      <AvatarImage source={{ uri: user.image }} />
                      <AvatarFallback>
                        <Text>{getInitials(user.name)}</Text>
                      </AvatarFallback>
                    </Avatar>
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

function LeaderboardCard({ user, index }: { user: User; index: number }) {
  return (
    <Link
      href={{
        pathname: '/(tabs)/(courts)/user/[userId]',
        params: { userId: user.id },
      }}>
      <View className="flex flex-col items-center gap-2">
        <View className="relative">
          <Avatar className="size-14" alt={`${user.name}'s image`}>
            <AvatarImage source={{ uri: user.image }} />
            <AvatarFallback>
              <Text>{getInitials(user.name)}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="absolute bottom-0 right-0 size-5 items-center justify-center rounded-full bg-primary">
            <Text className="text-sm font-semibold text-primary-foreground">{index + 1}</Text>
          </View>
        </View>
        <View className="flex flex-row items-center gap-2">
          <View className="flex size-7 items-center justify-center rounded-full border border-border bg-muted/30">
            <Text className="text-xs font-bold">{user.overall}</Text>
          </View>
          <Text className="text-sm font-semibold">
            {user.name.split(' ')[0][0]}. {user.name.split(' ')[1]}
          </Text>
        </View>
      </View>
    </Link>
  );
}
