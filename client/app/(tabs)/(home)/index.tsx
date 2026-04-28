import { ActivePlayersSection } from '@/components/court/ActivePlayersSection';
import { CourtLeaderboardSection } from '@/components/court/CourtLeaderboardSection';
import CourtCheckInModal from '@/components/CourtCheckInModal';
import { CourtNameLabel } from '@/components/CourtNameLabel';
import { NativewindScrollView } from '@/components/NativewindScrollView';
import { useCourtSession } from '@/components/providers/CourtSessionProvider';
import { useLocation } from '@/components/providers/LocationProvider';
import { RatingHistoryGraph } from '@/components/RatingHistoryGraph';
import { RecentSessionCard } from '@/components/RecentSessionCard';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useTabContext } from '@/hooks/useTabContext';
import { authClient } from '@/lib/auth-client';
import { getHome } from '@/lib/endpoints';
import { openDirections } from '@/lib/utils';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRight,
  MapPinIcon,
  MapPinnedIcon,
} from 'lucide-react-native';
import { useCallback, useRef } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

export default function HomePage() {
  const { location } = useLocation();

  const { data: home, isPending } = useQuery({
    queryKey: ['home'],
    queryFn: () =>
      getHome({
        lat: location?.coords.latitude!,
        lng: location?.coords.longitude!,
      }),
  });

  const { activeCourtSession, checkOut, isCheckInPending, isCheckOutPending, unratedCourtSession } =
    useCourtSession();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const { data: currentUserData } = authClient.useSession();

  const tabContext = useTabContext();

  const router = useRouter();

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <NativewindScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerClassName="flex w-full flex-col gap-8 px-4 py-6"
          keyboardShouldPersistTaps="handled">
          {isPending ? (
            <View className="flex-1 items-center justify-center pt-12">
              <ActivityIndicator />
            </View>
          ) : (
            home && (
              <>
                <View className="flex flex-col gap-8">
                  <View className="flex flex-row items-center gap-3">
                    <Avatar
                      className="size-14"
                      alt={`${currentUserData?.user.name}'s image`}
                      source={{ uri: currentUserData?.user.image ?? undefined }}
                    />
                    <View className="flex flex-col">
                      <Text className="font-medium text-muted-foreground">Welcome back,</Text>
                      <Text className="text-2xl font-bold">{currentUserData?.user.name}</Text>
                    </View>
                  </View>
                  <View className="flex flex-row items-center justify-between px-4">
                    <View className="flex flex-col items-center gap-1">
                      <Text className="text-xl font-bold">{home.user.overall}</Text>
                      <Text className="text-sm text-muted-foreground">Overall</Text>
                    </View>
                    <Separator orientation="vertical" />
                    <View className="flex flex-col items-center gap-1">
                      <Text className="text-xl font-bold">{home.user.archetype}</Text>
                      <Text className="text-sm text-muted-foreground">Archetype</Text>
                    </View>
                    <Separator orientation="vertical" />
                    <View className="flex flex-col items-center gap-1">
                      <Text className="text-xl font-bold">{home.user.height}</Text>
                      <Text className="text-sm text-muted-foreground">Height</Text>
                    </View>
                  </View>
                </View>

                <View className="flex flex-col gap-4">
                  <Text className="text-lg font-semibold">Overall History</Text>
                  <RatingHistoryGraph points={home.ratingHistory} />
                  <Separator />
                </View>

                <View className="flex flex-col gap-4">
                  <Text className="text-lg font-semibold">Most Recent Session</Text>
                  {home.recentSession ? (
                    <RecentSessionCard session={home.recentSession} />
                  ) : (
                    <Text className="text-center text-sm font-medium text-muted-foreground">
                      No sessions yet.
                    </Text>
                  )}
                </View>

                {home.primaryCourt && (
                  <>
                    <View className="flex flex-col gap-4">
                      <Text className="text-lg font-semibold">Your Main Court</Text>
                      <View className="flex w-full flex-1 flex-row items-center gap-3">
                        <AspectRatio
                          ratio={1 / 1}
                          className="relative h-[64px] overflow-hidden rounded-md">
                          <Image
                            source={{ uri: home.primaryCourt.image }}
                            style={{ width: '100%', height: '100%' }}
                            className="absolute inset-0 object-cover"
                          />
                        </AspectRatio>
                        <View className="flex flex-col gap-1">
                          <CourtNameLabel
                            collegeName={home.primaryCourt.collegeName}
                            collegeColor={home.primaryCourt.collegeColor}
                            courtName={home.primaryCourt.name}
                            size="lg"
                          />
                          <View className="flex flex-row items-center gap-3">
                            <View className="flex flex-row items-center gap-1">
                              <Icon as={MapPinIcon} className="text-muted-foreground" size={16} />
                              <Text className="text-sm font-medium text-muted-foreground">
                                {home.primaryCourt.distance.toFixed(1)} mi
                              </Text>
                            </View>
                            <Pressable
                              className="flex flex-row items-center gap-1"
                              onPress={() =>
                                router.push({
                                  pathname: `/(tabs)/(${tabContext})/court/[courtId]` as const,
                                  params: { courtId: home.primaryCourt.id },
                                })
                              }>
                              <Text className="text-sm font-medium text-muted-foreground">
                                See More
                              </Text>
                              <Icon as={ChevronRight} className="text-muted-foreground" size={16} />
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View className="flex w-full flex-1 flex-row items-center gap-2">
                      {activeCourtSession && activeCourtSession.courtId == home.primaryCourt.id ? (
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
                          disabled={
                            isCheckInPending || !!activeCourtSession || !!unratedCourtSession
                          }
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
                        onPress={() => openDirections(home.primaryCourt.address)}>
                        <Icon as={MapPinnedIcon} size={18} />
                        <Text>Directions</Text>
                      </Button>
                    </View>
                    <ActivePlayersSection
                      courtId={home.primaryCourt.id}
                      currentActiveSessions={home.primaryCourt.currentActiveSessions}
                      currentActiveUsers={home.primaryCourt.currentActiveUsers}
                    />
                    <Separator />
                    <CourtLeaderboardSection
                      courtId={home.primaryCourt.id}
                      leaderboard={home.primaryCourt.leaderboard}
                    />
                  </>
                )}
              </>
            )
          )}
        </NativewindScrollView>
      </KeyboardAvoidingView>
      {home?.primaryCourt && (
        <CourtCheckInModal bottomSheetModalRef={bottomSheetModalRef} court={home.primaryCourt} />
      )}
    </>
  );
}
