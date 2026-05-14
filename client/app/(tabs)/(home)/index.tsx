import { ActivePlayersModal } from '@/components/design/ActivePlayersModal';
import { ArchetypeDisplay } from '@/components/design/ArchetypeDisplay';
import { DeltaIndicator } from '@/components/design/DeltaIndicator';
import { OVRDisplay } from '@/components/design/OVRDisplay';
import { NativewindScrollView } from '@/components/NativewindScrollView';
import { useCourtSession } from '@/components/providers/CourtSessionProvider';
import { useLocation } from '@/components/providers/LocationProvider';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useTabContext } from '@/hooks/useTabContext';
import { authClient } from '@/lib/auth-client';
import { getHome } from '@/lib/endpoints';
import { cn, openDirections } from '@/lib/utils';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  LogInIcon,
  LogOutIcon,
  Navigation
} from 'lucide-react-native';
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
        {isPending ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" className="text-muted-foreground" />
          </View>
        ) : (
          home && (
            <NativewindScrollView
              contentInsetAdjustmentBehavior="automatic"
              contentContainerClassName="flex w-full flex-col gap-8 py-6"
              keyboardShouldPersistTaps="handled">
              <View className="flex flex-col px-4">
                <View className="flex flex-row items-end justify-between">
                  <View className="flex flex-col">
                    <View className="flex flex-row items-end gap-2">
                      <View className="flex flex-col">
                        <Text className="text-xs font-semibold tracking-wider text-muted-foreground">
                          YOUR OVERALL
                        </Text>
                        <OVRDisplay value={home.userData.overall} size="xl" />
                      </View>
                      {home.userData.overallDelta !== null && home.userData.overallDelta !== 0 && (
                        <View className="flex flex-row items-center mb-10">
                          <DeltaIndicator size='xl' value={home.userData.overallDelta} />
                        </View>
                      )}
                    </View>
                    <ArchetypeDisplay
                      archetype={home.userData.archetype}
                      variant="hero"
                      size="md"
                    />
                  </View>
                  <View className="flex flex-col items-end gap-1">
                    <View className="flex flex-row items-baseline gap-1">
                      <Text
                        style={{ fontFamily: 'BebasNeue_400Regular', lineHeight: 54 }}
                        className="text-5xl tabular-nums">
                        #{home.userData.rank ?? '—'}
                      </Text>
                    </View>
                    <View className="flex flex-row items-center gap-1.5">
                      <Text className="text-[13px] text-muted-foreground">
                        At {home.primaryCourt.collegeName}
                      </Text>
                      <DeltaIndicator value={home.userData.rankDelta} size="sm" />
                    </View>
                  </View>
                </View>
              </View>
              <View className="flex flex-col gap-6">
                <View className="flex flex-col gap-1.5 px-4">
                  <View className="flex flex-row items-center justify-between">
                    <Text className="font-semibold">{home.primaryCourt.name}</Text>
                    {home.activePlayers.length > 0 && (
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
                          {home.activePlayers.length} playing
                        </Text>
                      </View>
                    )}
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
                  <View className="flex flex-col">
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
                        className={cn(
                          'flex flex-row items-center justify-between border-b border-border px-4 py-3',
                          i == 0 && 'border-t',
                          player.id === currentUserData?.user.id &&
                            'border-l-2 border-l-foreground bg-card'
                        )}>
                        <View className="flex flex-row items-center gap-3">
                          <View className="relative">
                            <Avatar
                              className="size-10"
                              alt={player.name}
                              source={{ uri: player.image ?? undefined }}
                            />
                            <View
                              className="absolute bottom-0.5 right-0.5 size-2 rounded-full bg-green-400"
                              style={{
                                shadowColor: '#4ade80',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.8,
                                shadowRadius: 4,
                              }}
                            />
                          </View>

                          <View className="flex flex-col gap-1">
                            <Text className="font-semibold">
                              {player.name}
                              {player.id === currentUserData?.user.id && (
                                <Text className="text-muted-foreground"> (You)</Text>
                              )}
                            </Text>
                            <ArchetypeDisplay size="md" archetype={player.archetype} />
                          </View>
                        </View>
                        <View className="flex flex-col items-center">
                          <OVRDisplay value={player.overall} size="sm" />
                          <Text className="text-[10px] font-medium tracking-tight text-muted-foreground">
                            OVR
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                    {home.activePlayers.length > 3 && (
                      <Pressable
                        onPress={handlePresentActivePlayersModal}
                        className="flex flex-row items-center gap-1 self-center px-4 pt-4">
                        <Text className="text-sm font-medium text-muted-foreground">View all</Text>
                        <Icon as={ChevronRight} size={16} className="text-muted-foreground" />
                      </Pressable>
                    )}
                  </View>
                ) : (
                  <View className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8">
                    <Text className="text-sm text-muted-foreground">No one's playing</Text>
                    <Text className="mt-1 text-xs text-muted-foreground">
                      Be the first one out there
                    </Text>
                  </View>
                )}

                {/* Check In/Out Button */}
                <View className="flex flex-col gap-3">
                  {isCheckedIn ? (
                    <Button
                      disabled={isCheckOutPending}
                      onPress={checkOut}
                      size="lg"
                      className="mx-4 h-14 rounded-2xl">
                      <Text className="font-bold">Check Out</Text>
                      {isCheckOutPending ? (
                        <ActivityIndicator size="small" className="ml-2 text-muted-foreground" />
                      ) : (
                        <Icon as={LogInIcon} className="text-primary-foreground" size={18} />
                      )}
                    </Button>
                  ) : (
                    <>
                      <Button
                        disabled={isCheckInPending || !!activeCourtSession || !!unratedCourtSession}
                        onPress={() => checkIn(home.primaryCourt.id)}
                        size="lg"
                        className="h-14 rounded-2xl">
                        <Text className="font-bold text-primary-foreground">Check In to Play</Text>
                        {isCheckInPending ? (
                          <ActivityIndicator size="small" className="ml-2 text-muted-foreground" />
                        ) : (
                          <Icon as={LogOutIcon} className="text-primary-foreground" size={18} />
                        )}
                      </Button>
                      {unratedCourtSession && (
                        <Text className="text-center text-xs text-destructive">
                          Rate your last session before checking in again
                        </Text>
                      )}
                      {!unratedCourtSession && (
                        <Text className="text-center text-xs text-muted-foreground">
                          GPS verifies you're at {home.primaryCourt.name}
                        </Text>
                      )}
                    </>
                  )}
                </View>
              </View>
            </NativewindScrollView>
          )
        )}
      </KeyboardAvoidingView>

      {/* Modals */}
      {home?.primaryCourt && (
        <ActivePlayersModal
          bottomSheetRef={activePlayersModalRef}
          players={home.activePlayers}
          courtName={home.primaryCourt.name}
        />
      )}
    </>
  );
}
