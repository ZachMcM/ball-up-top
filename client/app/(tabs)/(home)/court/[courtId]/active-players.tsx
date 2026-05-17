import { ArchetypeDisplay } from '@/components/design/ArchetypeDisplay';
import { OVRDisplay } from '@/components/design/OVRDisplay';
import { NativewindFlatList } from '@/components/NativewindFlatList';
import { useCourtSession } from '@/components/providers/CourtSessionProvider';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useTabContext } from '@/hooks/useTabContext';
import { authClient } from '@/lib/auth-client';
import { getCourtActivePlayers } from '@/lib/endpoints';
import { cn, openDirections } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { AlertTriangleIcon, MapIcon } from 'lucide-react-native';
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
      <Stack.Screen
        options={{
          headerTitle: data?.court.name ?? 'Court',
          headerRight: () =>
            data && (
              <Pressable
                className="active:opacity-70"
                onPress={() => openDirections(data.court.address)}>
                <Icon as={MapIcon} size={22} />
              </Pressable>
            ),
        }}
      />
      <View className="flex-1">
        {isPending ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" className="text-muted-foreground" />
          </View>
        ) : data ? (
          <View className="flex flex-1 flex-col gap-2 pt-6">
            <View className="px-4">
              <Input
                className="h-10 rounded-full"
                placeholder={`Search from ${players.length} live players...`}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <NativewindFlatList
              data={filteredPlayers}
              keyExtractor={(item) => item.id}
              renderItem={({ item: player, index }) => (
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: `/(tabs)/(${tabContext})/user/[userId]` as const,
                      params: { userId: player.id },
                    });
                  }}
                  className={cn(
                    'flex flex-row items-center justify-between border-b border-border px-4 py-3',
                    index === 0 && 'border-t',
                    player.id === currentUserData?.user.id &&
                      player.id === currentUserData?.user.id &&
                      'bg-muted-foreground/10 dark:bg-card'
                  )}>
                  <View className="flex flex-row items-center gap-3">
                    <View className="relative">
                      <Avatar
                        className="size-10"
                        alt={player.name}
                        source={{ uri: player.image ?? undefined }}
                      />
                      <View className="absolute bottom-0.5 right-0.5 size-2 rounded-full bg-green-400" />
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
                <Empty>
                  <EmptyTitle>No one's playing</EmptyTitle>
                  <EmptyDescription>Check in below and start the run.</EmptyDescription>
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
                    <ActivityIndicator size="small" className="text-primary-foreground" />
                  )}
                </Button>
              ) : (
                <View className="flex flex-col gap-2">
                  <Button disabled={checkInDisabled} onPress={() => checkIn(courtId)} size="lg">
                    <Text>Check In To Court</Text>
                    {isCheckInPending && (
                      <ActivityIndicator size="small" className="text-primary-foreground" />
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
