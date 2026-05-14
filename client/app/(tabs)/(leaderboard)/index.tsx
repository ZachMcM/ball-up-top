import { ArchetypeDisplay } from '@/components/design/ArchetypeDisplay';
import { DeltaIndicator } from '@/components/design/DeltaIndicator';
import { OVRDisplay } from '@/components/design/OVRDisplay';
import { NativewindFlatList } from '@/components/NativewindFlatList';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useTabContext } from '@/hooks/useTabContext';
import { authClient } from '@/lib/auth-client';
import { getLeaderboard } from '@/lib/endpoints';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

export default function LeaderboardPage() {
  const { data: currentUserData } = authClient.useSession();
  const currentUserId = currentUserData?.user.id;

  // Get the user's primary court ID
  const primaryCourtId = (currentUserData?.user as any)?.primaryCourtId;

  const { data: leaderboard, isPending } = useQuery({
    queryKey: ['leaderboard', primaryCourtId],
    queryFn: () => getLeaderboard(primaryCourtId!),
    enabled: !!primaryCourtId,
  });

  const currentUserEntry = useMemo(() => {
    return leaderboard?.users.find((u) => u.id === currentUserId);
  }, [leaderboard, currentUserId]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlayers = useMemo(() => {
    return leaderboard?.users.filter((u) => u.name.includes(searchQuery));
  }, [leaderboard?.users, searchQuery]);

  const router = useRouter();
  const tabContext = useTabContext();

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <View className="flex flex-1 flex-col gap-6 pt-6 pb-24">
        {isPending ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" />
          </View>
        ) : !leaderboard || leaderboard.users.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-center text-muted-foreground">No leaderboard data available</Text>
          </View>
        ) : (
          <>
            <View className="px-4">
              <Text className="text-xs font-medium text-muted-foreground">College Rankings</Text>
              <Text className="text-3xl font-bold">{leaderboard.court.collegeName}</Text>
            </View>
            <View className="px-4">
              <Input
                className="h-9 rounded-full"
                placeholder="Search players..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <NativewindFlatList
              ListHeaderComponent={
                leaderboard.topMovers && leaderboard.topMovers.length > 0 ? (
                  <View className="flex flex-col gap-2 px-4 mb-6">
                    <Text className="text-sm font-semibold text-muted-foreground">Top Movers</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 10 }}>
                      {leaderboard.topMovers.map((mover) => (
                        <Pressable
                          key={mover.id}
                          className="flex w-40 flex-col gap-2 rounded-2xl border border-border bg-card p-3"
                          onPress={() =>
                            router.push({
                              pathname: `/(tabs)/(${tabContext})/user/[userId]` as const,
                              params: { userId: mover.id },
                            })
                          }>
                          <View className="flex flex-row items-center gap-2">
                            <Avatar
                              className="size-7"
                              alt={mover.name}
                              source={{ uri: mover.image ?? undefined }}
                            />
                            <Text className="font-semibold">
                              {mover.name.split(' ')[0]} {mover.name.split(' ')[1][0]}.
                            </Text>
                          </View>
                          <View className="flex flex-row items-center gap-2">
                            <DeltaIndicator value={mover.rankImprovement} size="sm" />
                            <Text className="text-sm font-medium text-muted-foreground">Spots</Text>
                          </View>
                          <Text className="text-sm font-medium text-muted-foreground">
                            Now #{mover.rank} · {mover.overall} OVR
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                ) : null
              }
              data={filteredPlayers}
              renderItem={({ item: user, index }) => (
                <Pressable
                  key={user.id}
                  onPress={() =>
                    router.push({
                      pathname: `/(tabs)/(${tabContext})/user/[userId]` as const,
                      params: { userId: user.id },
                    })
                  }
                  className={cn(
                    'flex flex-row items-center justify-between border-b border-border px-4 py-3',
                    index == 0 && 'border-t',
                    user.id === currentUserData?.user.id && 'border-l-2 border-l-foreground bg-card'
                  )}>
                  <View className="flex flex-row items-center gap-1">
                    {user.rank && (
                      <Text
                        className={cn(
                          'font-bebas w-8 text-3xl tabular-nums leading-[33px]',
                          user.rank && user.rank <= 3 ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                        #{user.rank}
                      </Text>
                    )}
                    <View className="flex flex-row items-center gap-3">
                      <Avatar
                        className="size-10"
                        alt={user.name}
                        source={{ uri: user.image ?? undefined }}
                      />
                      <View className="flex flex-col gap-1">
                        <Text className="font-semibold">
                          {user.name}
                          {user.id === currentUserData?.user.id && (
                            <Text className="text-muted-foreground"> (You)</Text>
                          )}
                        </Text>
                        <ArchetypeDisplay
                          tone="muted"
                          size="md"
                          variant="inline"
                          archetype={user.archetype}
                        />
                      </View>
                    </View>
                  </View>
                  <View className="flex flex-col items-center">
                    <OVRDisplay value={user.overall} size="sm" />
                    <Text className="text-[10px] font-medium tracking-tight text-muted-foreground">
                      OVR
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          </>
        )}
        {/* Sticky pinned current user row (Leaderboard tab only) */}
        {currentUserEntry && (
          <View className="absolute bottom-2 left-3 right-3 flex flex-row items-center gap-3 rounded-2xl bg-foreground px-4 py-3">
            <Text className="font-bebas text-3xl font-extrabold leading-[33px] text-background">
              #{currentUserEntry.rank ?? '—'}
            </Text>
            <View className="flex-1">
              <Text className="font-bold text-primary-foreground">Your Ranking</Text>
              <Text className="text-xs text-background/70">
                {getPositionContext(leaderboard?.users ?? [], currentUserEntry)}
              </Text>
            </View>
            <View className="flex flex-col items-center">
              <OVRDisplay
                value={currentUserEntry.overall}
                size="sm"
                className="text-primary-foreground"
              />
              <Text className="text-[10px] font-medium tracking-tight text-background/70">OVR</Text>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
