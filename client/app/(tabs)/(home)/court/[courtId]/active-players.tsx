import { ArchetypeDisplay } from '@/components/design/ArchetypeDisplay';
import { OVRDisplay } from '@/components/design/OVRDisplay';
import { NativewindFlatList } from '@/components/NativewindFlatList';
import { useCourtSession } from '@/components/providers/CourtSessionProvider';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useTabContext } from '@/hooks/useTabContext';
import { authClient } from '@/lib/auth-client';
import { getCourtActivePlayers } from '@/lib/endpoints';
import { cn, openDirections } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { AlertTriangleIcon, Navigation, UserX } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CourtActivePlayersPage() {
  const { courtId: courtIdParam } = useLocalSearchParams<{ courtId: string }>();
  const courtId = parseInt(courtIdParam!);
  const router = useRouter();
  const tabContext = useTabContext();
  const insets = useSafeAreaInsets();

  const { data, isPending } = useQuery({
    queryKey: ['court', courtId, 'active-players'],
    queryFn: () => getCourtActivePlayers(courtId),
    enabled: Number.isFinite(courtId),
  });

  const {
    activeCourtSession,
    checkIn,
    checkOut,
    isCheckInPending,
    isCheckOutPending,
    unratedCourtSession,
  } = useCourtSession();

  const { data: currentUserData } = authClient.useSession();

  const [searchQuery, setSearchQuery] = useState('');

  const players = data?.activePlayers ?? [];
  const filteredPlayers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return players;
    return players.filter(
      (p) => p.name.toLowerCase().includes(q) || p.archetype.toLowerCase().includes(q)
    );
  }, [players, searchQuery]);

  const isActiveHere = activeCourtSession?.courtId === courtId;
  const isActiveElsewhere = !!activeCourtSession && !isActiveHere;
  const checkInDisabled = isCheckInPending || !!activeCourtSession || !!unratedCourtSession;

  return (
    <>
      <Stack.Screen options={{ headerTitle: data?.court.name ?? 'Court' }} />
      <View className="flex-1">
        {isPending ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" className="text-muted-foreground" />
          </View>
        ) : data ? (
          <View className="flex-1">
            <View className="flex flex-col gap-4 px-4 pt-4">
              <Pressable
                onPress={() => openDirections(data.court.address)}
                className="flex flex-row items-center gap-1.5 self-start">
                <Icon as={Navigation} size={14} className="text-muted-foreground" />
                <Text className="text-sm font-medium text-muted-foreground">Get Directions</Text>
              </Pressable>
              <Input
                className="h-10 rounded-full"
                placeholder="Search players..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Text className="text-xs font-semibold text-muted-foreground">
                {players.length} {players.length === 1 ? 'player' : 'players'} live
              </Text>
            </View>
            <NativewindFlatList
              data={filteredPlayers}
              keyExtractor={(item) => item.id}
              renderItem={({ item: player }) => (
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: `/(tabs)/(${tabContext})/user/[userId]` as const,
                      params: { userId: player.id },
                    });
                  }}
                  className={cn(
                    'flex flex-row items-center justify-between border-b border-border px-4 py-3',
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
                          <Text className="font-normal text-muted-foreground"> (You)</Text>
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
              )}
              ListEmptyComponent={
                <Empty className="border border-dashed border-border m-4">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Icon size={22} as={UserX} className="text-secondary-foreground" />
                    </EmptyMedia>
                    <EmptyTitle>No one's playing</EmptyTitle>
                    <EmptyDescription>Be the first one out there!</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              }
              contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}
            />
            <View
              className="border-t border-border bg-background px-4 pt-3"
              style={{ paddingBottom: insets.bottom + 12 }}>
              {isActiveHere ? (
                <Button disabled={isCheckOutPending} onPress={checkOut} size="lg">
                  <Text>Check Out Of Court</Text>
                  {isCheckOutPending && (
                    <ActivityIndicator size="small" className="ml-2 text-muted-foreground" />
                  )}
                </Button>
              ) : (
                <View className="flex flex-col gap-2">
                  <Button disabled={checkInDisabled} onPress={() => checkIn(courtId)} size="lg">
                    <Text>Check In To Court</Text>
                    {isCheckInPending && (
                      <ActivityIndicator size="small" className="ml-2 text-muted-foreground" />
                    )}
                  </Button>
                  {unratedCourtSession ? (
                    <View className="flex flex-row items-center gap-2 self-center">
                      <Icon as={AlertTriangleIcon} className="text-muted-foreground" />
                      <Text className="text-center text-xs text-muted-foreground">
                        Rate your last session before checking in again
                      </Text>
                    </View>
                  ) : isActiveElsewhere ? (
                    <Text className="text-center text-xs text-muted-foreground">
                      Check out of your current court first
                    </Text>
                  ) : (
                    <Text className="text-center text-xs text-muted-foreground">
                      GPS verifies you're at {data.court.name}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted-foreground">Court not found</Text>
          </View>
        )}
      </View>
    </>
  );
}
