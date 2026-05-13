import { ActivePlayersModal } from '@/components/design/ActivePlayersModal';
import { ArchetypeDisplay } from '@/components/design/ArchetypeDisplay';
import { ArchetypePill } from '@/components/design/ArchetypePill';
import { DeltaIndicator } from '@/components/design/DeltaIndicator';
import { OVRDisplay } from '@/components/design/OVRDisplay';
import { NativewindScrollView } from '@/components/NativewindScrollView';
import { SessionFooter, useCourtSession } from '@/components/providers/CourtSessionProvider';
import { useLocation } from '@/components/providers/LocationProvider';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useTabContext } from '@/hooks/useTabContext';
import { authClient } from '@/lib/auth-client';
import { getHome } from '@/lib/endpoints';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { openDirections } from '@/lib/utils';
import { ChevronRight, MapPin, Navigation } from 'lucide-react-native';
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

  const activePlayersModalRef = useRef<BottomSheetModal>(null);

  const handlePresentActivePlayersModal = useCallback(() => {
    activePlayersModalRef.current?.present();
  }, []);

  const { data: currentUserData } = authClient.useSession();
  const tabContext = useTabContext();
  const router = useRouter();

  const isCheckedIn = activeCourtSession && activeCourtSession.courtId === home?.primaryCourt?.id;

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
            home &&
            home.userData && (
              <>
                {/* Player Identity Section */}
                <View className="flex flex-col gap-4">
                  <View className="flex flex-row items-end justify-between">
                    <View className="flex flex-col">
                      <View className="flex flex-row items-end gap-3">
                        <View className="flex flex-col">
                          <Text className="text-xs font-semibold tracking-wider text-muted-foreground">
                            YOUR OVERALL
                          </Text>
                          <OVRDisplay value={home.userData.overall} size="xl" />
                        </View>
                        {home.userData.overallDelta !== null &&
                          home.userData.overallDelta !== 0 && (
                            <View className="pb-6">
                              <DeltaIndicator
                                value={home.userData.overallDelta}
                                type="ovr"
                                size="lg"
                              />
                            </View>
                          )}
                      </View>
                      <ArchetypeDisplay
                        archetype={home.userData.archetype}
                        variant="hero"
                        size="md"
                        className="-mt-1"
                      />
                    </View>
                    <View className="flex flex-col items-end gap-1 pb-2">
                      <View className="flex flex-row items-baseline gap-1">
                        <Text className="text-4xl font-extrabold tabular-nums">
                          #{home.userData.rank ?? '—'}
                        </Text>
                      </View>
                      <View className="flex flex-row items-center gap-1.5">
                        <Text className="text-xs text-muted-foreground">At {home.primaryCourt.collegeName}</Text>
                        <DeltaIndicator value={home.userData.rankDelta} type="rank" size="sm" />
                      </View>
                    </View>
                  </View>
                  <Pressable
                    className="flex flex-row items-center justify-between rounded-xl bg-muted/50 px-4 py-3"
                    onPress={() => router.push({ pathname: '/(tabs)/(leaderboard)' })}>
                    <Text className="text-sm font-medium text-muted-foreground">
                      View full leaderboard
                    </Text>
                    <Icon as={ChevronRight} size={16} className="text-muted-foreground" />
                  </Pressable>
                </View>

                {/* Court Section */}
                {home.primaryCourt && (
                  <View className="flex flex-col gap-4">
                    {/* Court Header */}
                    <View className="flex flex-col gap-2">
                      <View className="flex flex-row items-center justify-between">
                        <View className="flex flex-row items-center gap-2">
                          <Icon as={MapPin} size={14} className="text-muted-foreground" />
                          <Text className="text-sm font-medium text-muted-foreground">
                            {home.primaryCourt.collegeName}
                          </Text>
                          <Text className="text-sm font-semibold">{home.primaryCourt.name}</Text>
                        </View>
                        {/* {home.activePlayers.length > 0 && (
                          <View className="flex flex-row items-center gap-1.5">
                            <View
                              className="size-2 rounded-full bg-green-400"
                              style={{
                                shadowColor: '#4ade80',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.8,
                                shadowRadius: 4,
                              }}
                            />
                            <Text className="text-xs font-semibold text-green-400">
                              {home.activePlayers.length} live
                            </Text>
                          </View>
                        )} */}
                      </View>
                      <Pressable
                        onPress={() => openDirections(home.primaryCourt.address)}
                        className="flex flex-row items-center gap-1.5 self-start">
                        <Icon as={Navigation} size={12} className="text-muted-foreground" />
                        <Text className="text-xs font-medium text-muted-foreground">
                          Get Directions
                        </Text>
                      </Pressable>
                    </View>

                    {/* Active Players */}
                    {home.activePlayers.length > 0 ? (
                      <View className="flex flex-col rounded-xl border border-border bg-card">
                        {home.activePlayers.slice(0, 3).map((player, i) => (
                          <Pressable
                            key={player.id ?? i}
                            onPress={() => {
                              if (player.id) {
                                router.push({
                                  pathname: `/(tabs)/(${tabContext})/user/[userId]` as const,
                                  params: { userId: player.id },
                                });
                              }
                            }}
                            className={`flex flex-row items-center gap-3 px-4 py-3 ${
                              i < Math.min(home.activePlayers.length - 1, 2)
                                ? 'border-b border-border'
                                : ''
                            }`}>
                            <View className="relative">
                              <Avatar
                                className="size-10"
                                alt={player.name}
                                source={{ uri: player.image ?? undefined }}
                              />
                              <View className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-green-400" />
                            </View>
                            <View className="flex flex-1 flex-col gap-0.5">
                              <Text className="font-semibold">
                                {player.name}
                                {player.id === currentUserData?.user.id && (
                                  <Text className="text-muted-foreground"> (you)</Text>
                                )}
                              </Text>
                              <ArchetypePill archetype={player.archetype} tone="ghost" size="sm" />
                            </View>
                            <Text
                              className="text-lg tabular-nums text-foreground"
                              style={{ fontFamily: 'BebasNeue_400Regular' }}>
                              {player.overall}
                            </Text>
                          </Pressable>
                        ))}
                        {home.activePlayers.length > 3 && (
                          <Pressable
                            onPress={handlePresentActivePlayersModal}
                            className="flex flex-row items-center justify-center border-t border-border py-3">
                            <Text className="text-sm font-semibold text-muted-foreground">
                              View all {home.activePlayers.length} players
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    ) : (
                      <View className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8">
                        <Text className="text-sm text-muted-foreground">No one's playing</Text>
                        <Text className="mt-1 text-xs text-muted-foreground/70">
                          Be the first one out there
                        </Text>
                      </View>
                    )}

                    {/* Check In/Out Button */}
                    <View className="flex flex-col gap-2">
                      {isCheckedIn ? (
                        <Button
                          disabled={isCheckOutPending}
                          onPress={checkOut}
                          size="lg"
                          className="h-14 rounded-2xl">
                          <Text className="text-base font-semibold">Check Out</Text>
                          {isCheckOutPending && <ActivityIndicator className="ml-2" />}
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
                            <Text className="text-base font-bold text-primary-foreground">
                              Check In to Play
                            </Text>
                            {isCheckInPending && <ActivityIndicator className="ml-2" />}
                          </Button>
                          {unratedCourtSession && (
                            <Text className="text-center text-xs text-destructive">
                              Rate your last session before checking in again
                            </Text>
                          )}
                          {!unratedCourtSession && (
                            <Text className="text-center text-xs text-muted-foreground/70">
                              GPS verifies you're at {home.primaryCourt.name}
                            </Text>
                          )}
                        </>
                      )}
                    </View>
                  </View>
                )}
              </>
            )
          )}
        </NativewindScrollView>
      </KeyboardAvoidingView>

      {/* Modals */}
      {home?.primaryCourt && (
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
      )}
    </>
  );
}
