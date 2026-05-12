import { ArchetypePill } from '@/components/design/ArchetypePill';
import { DeltaIndicator } from '@/components/design/DeltaIndicator';
import { OVRDisplay } from '@/components/design/OVRDisplay';
import { SegmentedControl } from '@/components/design/SegmentedControl';
import { NativewindScrollView } from '@/components/NativewindScrollView';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useTabContext } from '@/hooks/useTabContext';
import { authClient } from '@/lib/auth-client';
import { getCourtPlayers, getLeaderboard } from '@/lib/endpoints';
import { cn } from '@/lib/utils';
import { FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'Leaderboard' | 'Players'>('Leaderboard');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: currentUserData } = authClient.useSession();
  const currentUserId = currentUserData?.user.id;

  // Get the user's primary court ID
  const primaryCourtId = (currentUserData?.user as any)?.primaryCourtId;

  const { data: leaderboard, isPending: isLeaderboardPending } = useQuery({
    queryKey: ['leaderboard', primaryCourtId],
    queryFn: () => getLeaderboard(primaryCourtId!),
    enabled: !!primaryCourtId,
  });

  const { data: allPlayers, isPending: isPlayersPending } = useQuery({
    queryKey: ['courtPlayers', primaryCourtId],
    queryFn: () => getCourtPlayers(primaryCourtId!),
    enabled: !!primaryCourtId && activeTab === 'Players',
  });

  const currentUserEntry = useMemo(() => {
    return leaderboard?.orderedUsers.find((u) => u.userId === currentUserId);
  }, [leaderboard, currentUserId]);

  const filteredPlayers = useMemo(() => {
    if (!allPlayers) return [];
    if (!searchQuery.trim()) return allPlayers;
    const query = searchQuery.toLowerCase();
    return allPlayers.filter(
      (p) => p.name.toLowerCase().includes(query) || p.archetype.toLowerCase().includes(query)
    );
  }, [allPlayers, searchQuery]);

  const router = useRouter();
  const tabContext = useTabContext();

  const handleUserPress = (userId: string) => {
    router.push({
      pathname: `/(tabs)/(${tabContext})/user/[userId]` as const,
      params: { userId },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <View className="flex-1">
        {/* Header */}
        <View className="border-b border-border px-4 py-4">
          <Text className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Campus Rankings
          </Text>
          <Text className="mt-1 text-2xl font-extrabold tracking-tight">
            {(currentUserData?.user as any)?.primaryCourt?.collegeName ?? 'Your Campus'}
          </Text>
        </View>

        {/* Segmented Control */}
        <View className="px-4 py-3">
          <SegmentedControl
            options={['Leaderboard', 'Players']}
            selected={activeTab}
            onChange={(v) => setActiveTab(v as 'Leaderboard' | 'Players')}
          />
        </View>

        {activeTab === 'Leaderboard' ? (
          <LeaderboardTab
            leaderboard={leaderboard}
            isPending={isLeaderboardPending}
            currentUserId={currentUserId}
            onUserPress={handleUserPress}
          />
        ) : (
          <PlayersTab
            players={filteredPlayers}
            isPending={isPlayersPending}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentUserId={currentUserId}
            onUserPress={handleUserPress}
          />
        )}

        {/* Sticky pinned current user row (Leaderboard tab only) */}
        {activeTab === 'Leaderboard' && currentUserEntry && (
          <Pressable
            onPress={() => handleUserPress(currentUserEntry.userId)}
            className="absolute bottom-2 left-3 right-3 flex flex-row items-center gap-3 rounded-2xl bg-foreground px-4 py-3"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.5,
              shadowRadius: 24,
            }}>
            <Text className="text-xl font-extrabold text-background">
              {currentUserEntry.rank ?? '—'}
            </Text>
            <View className="flex-1">
              <Text className="font-extrabold text-background">
                You · {currentUserEntry.archetype}
              </Text>
              <Text className="text-xs text-background/70">
                {getPositionContext(leaderboard?.orderedUsers ?? [], currentUserEntry)}
              </Text>
            </View>
            <OVRDisplay value={currentUserEntry.overall} size="md" color="#0a0a0a" />
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function getPositionContext(
  orderedUsers: { rank: number | null; overall: number; name: string }[],
  currentUser: { rank: number | null; overall: number }
): string {
  if (!currentUser.rank || currentUser.rank <= 1) return "You're at the top!";

  const userAbove = orderedUsers.find((u) => u.rank === currentUser.rank! - 1);
  if (!userAbove) return '';

  const ovrDiff = userAbove.overall - currentUser.overall;
  return `${ovrDiff} OVR behind ${userAbove.name}`;
}

function LeaderboardTab({
  leaderboard,
  isPending,
  currentUserId,
  onUserPress,
}: {
  leaderboard: any;
  isPending: boolean;
  currentUserId?: string;
  onUserPress: (userId: string) => void;
}) {
  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!leaderboard) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-center text-muted-foreground">No leaderboard data available</Text>
      </View>
    );
  }

  const { orderedUsers, topMovers } = leaderboard;

  return (
    <NativewindScrollView
      contentContainerClassName="pb-24"
      showsVerticalScrollIndicator={false}>
      {/* Top Movers */}
      {topMovers && topMovers.length > 0 && (
        <View className="px-4 py-3">
          <Text className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Top Movers · 7 days
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
            contentContainerStyle={{ gap: 10 }}>
            {topMovers.map((mover: any) => (
              <Pressable key={mover.userId} onPress={() => onUserPress(mover.userId)}>
                <Card className="w-36 p-3">
                  <View className="flex flex-row items-center gap-2">
                    <Avatar
                      className="size-7"
                      alt={mover.name}
                      source={{ uri: mover.image ?? undefined }}
                    />
                    <Text className="flex-1 font-bold" numberOfLines={1}>
                      {mover.name}
                    </Text>
                  </View>
                  <View className="mt-2 flex flex-row items-baseline gap-1.5">
                    <DeltaIndicator value={mover.rankImprovement} type="rank" size="lg" />
                    <Text className="text-xs text-muted-foreground">spots</Text>
                  </View>
                  <Text className="mt-1 text-xs text-muted-foreground/70">
                    Now #{mover.rank} · {mover.overall} OVR
                  </Text>
                </Card>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Full Leaderboard */}
      <View className="mt-2 border-t border-border">
        {orderedUsers.map((user: any) => {
          const isCurrentUser = user.userId === currentUserId;
          return (
            <Pressable
              key={user.userId}
              onPress={() => onUserPress(user.userId)}
              className={cn(
                'flex flex-row items-center gap-3 border-b border-border px-4 py-3',
                isCurrentUser && 'border-l-2 border-l-foreground bg-card'
              )}>
              <Text
                className={cn(
                  'w-8 text-xl font-extrabold tabular-nums',
                  user.rank && user.rank <= 3 ? 'text-foreground' : 'text-muted-foreground'
                )}>
                {user.rank ?? '—'}
              </Text>
              <Avatar
                className={cn('size-9', isCurrentUser && 'ring-2 ring-foreground ring-offset-2 ring-offset-background')}
                alt={user.name}
                source={{ uri: user.image ?? undefined }}
              />
              <View className="flex-1">
                <Text className="font-bold">
                  {user.name}
                  {isCurrentUser && <Text className="text-muted-foreground font-semibold"> · you</Text>}
                </Text>
                <ArchetypePill archetype={user.archetype} tone="ghost" size="sm" className="mt-1" />
              </View>
              <View className="flex flex-col items-end gap-1">
                <OVRDisplay value={user.overall} size="sm" />
                {/* TODO: Add rank delta when available from API */}
              </View>
            </Pressable>
          );
        })}
      </View>
    </NativewindScrollView>
  );
}

function PlayersTab({
  players,
  isPending,
  searchQuery,
  onSearchChange,
  currentUserId,
  onUserPress,
}: {
  players: any[];
  isPending: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUserId?: string;
  onUserPress: (userId: string) => void;
}) {
  return (
    <View className="flex-1">
      {/* Search */}
      <View className="px-4 pb-3">
        <View className="flex flex-row items-center gap-3 rounded-full bg-muted/50 px-4 py-2">
          <Icon as={Search} size={18} className="text-muted-foreground" />
          <Input
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search players..."
            placeholderTextColor="#a3a3a3"
            className="flex-1 border-0 bg-transparent p-0"
          />
        </View>
      </View>

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : players.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-center text-muted-foreground">No players found</Text>
        </View>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item: any) => item.userId}
          renderItem={({ item: player }: { item: any }) => {
            const isCurrentUser = player.userId === currentUserId;
            return (
              <Pressable
                onPress={() => onUserPress(player.userId)}
                className={cn(
                  'flex flex-row items-center gap-3 border-b border-border px-4 py-3',
                  isCurrentUser && 'border-l-2 border-l-foreground bg-card'
                )}>
                <Avatar
                  className="size-9"
                  alt={player.name}
                  source={{ uri: player.image ?? undefined }}
                />
                <View className="flex-1">
                  <Text className="font-bold">{player.name}</Text>
                  <View className="mt-1 flex flex-row items-center gap-2">
                    <ArchetypePill archetype={player.archetype} tone="ghost" size="sm" />
                  </View>
                </View>
                <View className="flex flex-col items-end">
                  <OVRDisplay value={player.overall} size="sm" />
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    #{player.rank ?? '—'}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
