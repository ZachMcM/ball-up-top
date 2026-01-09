import { NativewindScrollView } from '@/components/NativewindScrollView';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { VerticalRatingBar } from '@/components/ui/vertical-rating-bar';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import { getUser } from '@/lib/endpoints';
import { THEME } from '@/lib/theme';
import { getInitials, timeAgo } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { LogOutIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const RATING_CATEGORIES = [
  { key: 'shootingRating', label: 'Shooting' },
  { key: 'finishingRating', label: 'Finishing' },
  { key: 'playmakingRating', label: 'Playmaking' },
  { key: 'defenseRating', label: 'Defense' },
] as const;

function formatSessionTime(startTime: string, endTime: string | null) {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : null;

  const dateStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const startTimeStr = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  if (end) {
    const endTimeStr = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${dateStr} • ${startTimeStr} - ${endTimeStr}`;
  }

  return `${dateStr} • ${startTimeStr} - Active`;
}

export default function ProfilePage() {
  const searchParams = useLocalSearchParams();
  const { userId } = searchParams as { userId: string };
  const { colorScheme } = useColorScheme();

  const { data: user, isPending } = useQuery({
    queryFn: async () => getUser(userId),
    queryKey: ['user', userId],
  });

  const { data: currentUserData } = authClient.useSession();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: user?.name ?? 'Profile',
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <NativewindScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerClassName="flex w-full flex-col gap-8 px-4 py-6"
          keyboardShouldPersistTaps="handled">
          {isPending ? (
            <ActivityIndicator />
          ) : (
            user && (
              <>
                <View className="flex w-full flex-row items-center justify-between">
                  <View className="flex flex-row items-center gap-3">
                    <Avatar className="size-16" alt={`${user.name}'s image`}>
                      <AvatarImage source={{ uri: user.image ?? undefined }} />
                      <AvatarFallback>
                        <Text>{getInitials(user.name)}</Text>
                      </AvatarFallback>
                    </Avatar>
                    <View className="flex flex-col">
                      <Text className="text-xl font-bold">{user.name}</Text>
                      <Text className="font-semibold text-muted-foreground">
                        {user.height} • {user.archetype}
                      </Text>
                    </View>
                  </View>
                  <View className="flex flex-col items-center">
                    <Text className="text-xl font-bold">{user.overall}</Text>
                    <Text className="text-sm font-medium text-muted-foreground">Overall</Text>
                  </View>
                </View>
                <View className="flex flex-1 flex-col gap-4 rounded-2xl border border-border p-4">
                  <Text className="text-lg font-semibold">RATINGS</Text>
                  <View className="flex flex-row">
                    {RATING_CATEGORIES.map(({ key, label }) => (
                      <VerticalRatingBar key={key} value={user[key]} label={label} />
                    ))}
                  </View>
                </View>
                <View className="flex flex-1 flex-col gap-4 rounded-2xl border border-border p-4">
                  <Text className="text-lg font-semibold">RATING HISTORY</Text>
                  {user.ratingHistory.length > 0 ? (
                    <LineChart
                      isAnimated
                      hideYAxisText
                      height={64}
                      thickness={2}
                      color={THEME[colorScheme!].primary}
                      dataPointsColor={THEME[colorScheme!].primary}
                      dataPointsRadius={2}
                      hideRules
                      xAxisThickness={0}
                      yAxisThickness={0}
                      spacing={96}
                      xAxisLabelTextStyle={{
                        color: THEME[colorScheme!].mutedForeground,
                        fontWeight: 500,
                        width: 96,
                        marginLeft: 32,
                      }}
                      data={user.ratingHistory.map((entry) => ({
                        value: entry.overall,
                        label: timeAgo(entry.createdAt),
                      }))}
                    />
                  ) : (
                    <Text className="text-center text-xs font-medium">No ratings data yet.</Text>
                  )}
                </View>
                <View className="flex flex-col gap-4 rounded-2xl border border-border p-4">
                  <Text className="text-lg font-semibold">RECENT SESSIONS</Text>
                  {user.recentSessions.length > 0 ? (
                    <View className="flex flex-col gap-3">
                      {user.recentSessions.map(({ court, id, startTime, endTime }) => (
                        <Link
                          href={{
                            pathname: '/court/[courtId]',
                            params: { courtId: court.id },
                          }}
                          key={id}
                          className="w-full">
                          <Card className="flex flex-row items-center gap-3 px-4 py-3">
                            <AspectRatio
                              ratio={1 / 1}
                              className="relative h-[48px] overflow-hidden rounded-md">
                              <Image
                                source={{
                                  uri: court.image,
                                }}
                                style={{ width: '100%', height: '100%' }}
                                className="absolute inset-0 object-cover"
                              />
                            </AspectRatio>
                            <View className="flex flex-1 flex-col">
                              <Text className="font-semibold">{court.name}</Text>
                              <Text className="text-sm text-muted-foreground">
                                {formatSessionTime(startTime, endTime)}
                              </Text>
                            </View>
                          </Card>
                        </Link>
                      ))}
                    </View>
                  ) : (
                    <View className="rounded-2xl border border-border bg-card p-4">
                      <Text className="text-center text-sm text-muted-foreground">
                        No sessions yet.
                      </Text>
                    </View>
                  )}
                </View>
                {user.id === currentUserData?.user.id && (
                  <View className="flex flex-1 flex-col gap-4 rounded-2xl border border-border p-4">
                    <Text className="text-lg font-semibold">Settings</Text>
                    <Button variant="destructive" className="justify-start">
                      <Icon className="text-destructive" as={LogOutIcon} />
                      <Text>Log Out</Text>
                    </Button>
                  </View>
                )}
              </>
            )
          )}
        </NativewindScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
