import CourtCheckInModal from '@/components/CourtCheckInModal';
import { ActivePlayersModal } from '@/components/design/ActivePlayersModal';
import { ArchetypePill } from '@/components/design/ArchetypePill';
import { DeltaIndicator } from '@/components/design/DeltaIndicator';
import { OVRDisplay } from '@/components/design/OVRDisplay';
import { NativewindScrollView } from '@/components/NativewindScrollView';
import { useCourtSession } from '@/components/providers/CourtSessionProvider';
import { useLocation } from '@/components/providers/LocationProvider';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useTabContext } from '@/hooks/useTabContext';
import { authClient } from '@/lib/auth-client';
import { getHome } from '@/lib/endpoints';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, ChevronRight } from 'lucide-react-native';
import React, { useCallback, useRef } from 'react';
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

  const {
    activeCourtSession,
    checkOut,
    checkIn,
    isCheckInPending,
    isCheckOutPending,
    unratedCourtSession,
  } = useCourtSession();

  const checkInModalRef = useRef<BottomSheetModal>(null);
  const activePlayersModalRef = useRef<BottomSheetModal>(null);

  const handlePresentCheckInModal = useCallback(() => {
    checkInModalRef.current?.present();
  }, []);

  const handlePresentActivePlayersModal = useCallback(() => {
    activePlayersModalRef.current?.present();
  }, []);

  const { data: currentUserData } = authClient.useSession();
  const tabContext = useTabContext();
  const router = useRouter();

  const isCheckedIn = activeCourtSession && activeCourtSession.courtId === home?.primaryCourt?.id!;

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <NativewindScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerClassName="flex w-full flex-col gap-6 px-4 py-6"
          keyboardShouldPersistTaps="handled">
          {isPending ? (
            <View className="flex-1 items-center justify-center pt-12">
              <ActivityIndicator />
            </View>
          ) : (
            home &&
            home.userData && (
              <>
                {/* OVR Card */}
                <Card className="gap-0 p-0">
                  {/* <View className="p-4">
                    <View className="flex flex-row items-center justify-between">
                      <Text className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Your Overall
                      </Text>
                    </View>

                    <View className="mt-4 flex flex-row items-end gap-4">
                      <OVRDisplay value={userData.overall} size="lg" />
                      <View className="mb-4 flex flex-col gap-2">
                        <ArchetypePill archetype={userData.archetype} tone="fill" size="md" />
                        <Text className="text-xs text-muted-foreground">OVR · 45-99 scale</Text>
                      </View>
                    </View>
                  </View> */}
                  <View className="flex flex-col p-4">
                    <Text className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Your Overall
                    </Text>
                    <View className="flex flex-row gap-4">
                      <OVRDisplay value={home.userData.overall} size="lg" />
                      <View className="flex flex-col gap-2 pt-6">
                        <ArchetypePill archetype={home.userData.archetype} tone="fill" size="md" />
                        <Text className="text-xs text-muted-foreground">OVR · 45-99 scale</Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex flex-row items-center justify-between border-t border-border px-4 py-3">
                    <View className="flex flex-row items-center gap-2">
                      <Text className="text-xl font-extrabold">#{home.userData.rank ?? '—'}</Text>
                      <Text className="text-xs text-muted-foreground">on campus</Text>
                      <DeltaIndicator value={home.userData.rankDelta} type="rank" size="sm" />
                      <Text className="text-xs text-muted-foreground/70">this week</Text>
                    </View>
                    <Pressable
                      className="flex flex-row items-center gap-2"
                      onPress={() =>
                        router.push({
                          pathname: '/(tabs)/(leaderboard)',
                        })
                      }>
                      <Text className="text-xs font-medium">View</Text>
                      <Icon as={ChevronRight} size={14} />
                    </Pressable>
                  </View>
                </Card>

                {/* Court Activity Card */}
                {home.primaryCourt && (
                  <Card className="p-0">
                    <View className="flex flex-row items-center justify-between p-4">
                      <View>
                        <View className="flex flex-row items-center gap-2">
                          {home.activePlayers.length > 0 && (
                            <View
                              className="size-2 rounded-full bg-green-400"
                              style={{
                                shadowColor: '#7CD992',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.6,
                                shadowRadius: 4,
                              }}
                            />
                          )}
                          <Text className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Live · {home.primaryCourt.collegeName} · {home.primaryCourt.name}
                          </Text>
                        </View>
                        <Text className="mt-1 text-lg font-bold">
                          {home.activePlayers.length === 0
                            ? 'No active players'
                            : `${home.activePlayers.length} live right now`}
                        </Text>
                      </View>
                      {home.activePlayers.length > 0 && (
                        <View className="flex flex-row items-center gap-1.5 rounded-full border border-green-400/30 bg-green-400/10 px-2 py-1">
                          <View className="size-1.5 rounded-full bg-green-400" />
                          <Text className="text-[10px] font-extrabold uppercase tracking-wider text-green-400">
                            Live
                          </Text>
                        </View>
                      )}
                    </View>

                    {home.activePlayers.length > 0 ? (
                      <View className="border-t border-border">
                        {home.activePlayers.slice(0, 3).map((player: any, i: number) => (
                          <Pressable
                            key={player.userId ?? player.id ?? i}
                            onPress={() => {
                              if (player.userId || player.id) {
                                router.push({
                                  pathname: `/(tabs)/(${tabContext})/user/[userId]` as const,
                                  params: { userId: player.userId ?? player.id },
                                });
                              }
                            }}
                            className="flex flex-row items-center gap-3 border-b border-border px-4 py-3">
                            <View className="relative">
                              <Avatar
                                className="size-8"
                                alt={player.name}
                                source={{ uri: player.image ?? undefined }}
                              />
                              <View className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card bg-green-400" />
                            </View>
                            <View className="flex flex-1 flex-row items-center gap-2">
                              <Text className="font-bold">
                                {player.name}
                                {player.userId === currentUserData?.user.id && ' (you)'}
                              </Text>
                              <ArchetypePill archetype={player.archetype} tone="ghost" size="sm" />
                            </View>
                            <Text className="font-mono text-sm font-semibold tabular-nums text-muted-foreground">
                              {player.overall}
                            </Text>
                          </Pressable>
                        ))}
                        {home.activePlayers.length > 3 && (
                          <Pressable
                            onPress={handlePresentActivePlayersModal}
                            className="flex flex-row items-center justify-between border-t border-border px-4 py-3">
                            <Text className="font-bold">See all {home.activePlayers.length} ›</Text>
                          </Pressable>
                        )}
                      </View>
                    ) : (
                      <View className="px-4 pb-4">
                        <Text className="text-sm text-muted-foreground">
                          Be the first one out there.
                        </Text>
                      </View>
                    )}
                  </Card>
                )}

                {/* Check In/Out Button */}
                {home.primaryCourt && (
                  <View className="flex flex-col gap-2">
                    {isCheckedIn ? (
                      <Button
                        disabled={isCheckOutPending}
                        onPress={checkOut}
                        size="lg"
                        variant="outline"
                        className="h-14 rounded-2xl">
                        <Icon as={ArrowLeftIcon} size={18} />
                        <Text>Check Out</Text>
                        {isCheckOutPending && <ActivityIndicator />}
                      </Button>
                    ) : (
                      <>
                        <Button
                          disabled={
                            isCheckInPending || !!activeCourtSession || !!unratedCourtSession
                          }
                          onPress={() => checkIn(home.primaryCourt.id)}
                          size="lg"
                          className="h-14 rounded-2xl">
                          <Text className="text-lg font-bold">Check In to Play</Text>
                          {isCheckInPending && <ActivityIndicator />}
                        </Button>
                        <Text className="text-center text-xs text-muted-foreground/70">
                          GPS verifies you're at {home.primaryCourt.collegeName}.
                        </Text>
                      </>
                    )}
                  </View>
                )}
              </>
            )
          )}
        </NativewindScrollView>
      </KeyboardAvoidingView>

      {/* Session Footer - shown when checked in */}
      {/* {isCheckedIn && primaryCourt && (
        <SessionFooterRedesigned courtName={primaryCourt.name} playerCount={activePlayerCount} />
      )} */}

      {/* Modals */}
      {home?.primaryCourt && (
        <>
          {/* <CourtCheckInModal bottomSheetModalRef={checkInModalRef} court={primaryCourt} /> */}
          <ActivePlayersModal
            bottomSheetRef={activePlayersModalRef}
            players={home.activePlayers.map((p) => ({
              userId: p.id,
              name: p.name,
              overall: p.overall,
              archetype: p.archetype,
              image: p.image,
            }))}
            courtName={home.primaryCourt.name}
          />
        </>
      )}
    </>
  );
}
