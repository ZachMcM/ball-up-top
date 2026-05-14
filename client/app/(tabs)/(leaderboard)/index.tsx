import { ArchetypeDisplay } from '@/components/design/ArchetypeDisplay';
import { DeltaIndicator } from '@/components/design/DeltaIndicator';
import { OVRDisplay } from '@/components/design/OVRDisplay';
import { NativewindFlatList } from '@/components/NativewindFlatList';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useTabContext } from '@/hooks/useTabContext';
import { authClient } from '@/lib/auth-client';
import { getLeaderboard } from '@/lib/endpoints';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
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
    <>
      <Stack.Screen
        options={{
          headerTitle: isPending ? 'Leaderboard' : `${leaderboard?.court.collegeName} Leaderboard`,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <View className="flex flex-1 flex-col gap-6 py-6">
          {isPending ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="small" />
            </View>
          ) : !leaderboard || leaderboard.users.length === 0 ? (
            <View className="flex-1 items-center justify-center px-4">
              <Text className="text-center text-muted-foreground">
                No leaderboard data available
              </Text>
            </View>
          ) : (
            <>
              {leaderboard.topMovers && leaderboard.topMovers.length > 0 && (
                <View className="px-4 py-3">
                  <Text className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Top Movers · 7 days
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 10 }}>
                    {leaderboard.topMovers.map((mover) => (
                      <Pressable
                        key={mover.id}
                        onPress={() =>
                          router.push({
                            pathname: `/(tabs)/(${tabContext})/user/[userId]` as const,
                            params: { userId: mover.id },
                          })
                        }>
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
                            <DeltaIndicator value={mover.rankImprovement} size="lg" />
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
              <View className="px-4">
                <Input
                  className="h-9 rounded-full px-4"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <NativewindFlatList
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
                      user.id === currentUserData?.user.id &&
                        'border-l-2 border-l-foreground bg-card'
                    )}>
                    <View className="flex flex-row items-center gap-1">
                      <Text
                        style={{
                          fontFamily: 'BebasNeue_400Regular',
                        }}
                        className={cn(
                          'w-8 text-3xl tabular-nums',
                          user.rank && user.rank <= 3 ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                        #{user.rank}
                      </Text>
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
              <Text
                style={{ fontFamily: 'BebasNeue_400Regular' }}
                className="text-3xl font-extrabold text-background">
                #{currentUserEntry.rank ?? '—'}
              </Text>
              <View className="flex-1">
                <Text className="font-bold text-primary-foreground">
                  Your Ranking
                </Text>
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
                <Text className="text-[10px] font-medium tracking-tight text-background/70">
                  OVR
                </Text>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
