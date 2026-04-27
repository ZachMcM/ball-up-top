import { NativewindScrollView } from '@/components/NativewindScrollView';
import { RecentSessionCard } from '@/components/RecentSessionCard';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { VerticalRatingBar } from '@/components/ui/vertical-rating-bar';
import { authClient } from '@/lib/auth-client';
import { getUser } from '@/lib/endpoints';
import { THEME } from '@/lib/theme';
import { timeAgo } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { LogOutIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const RATING_CATEGORIES = [
  { key: 'shootingRating', label: 'Shooting', color: 'bg-green-600' },
  { key: 'finishingRating', label: 'Finishing', color: 'bg-sky-600' },
  { key: 'playmakingRating', label: 'Playmaking', color: 'bg-amber-600' },
  { key: 'defenseRating', label: 'Defense', color: 'bg-rose-600' },
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

  const getHighestOvr = () => {
    let maxIndex = 0;
    user?.ratingHistory.forEach((point, i) => {
      if (user.ratingHistory[0].overall < point.overall) {
        maxIndex = i;
      }
    });

    return maxIndex;
  };

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
                    <Avatar
                      className="size-16"
                      alt={`${user.name}'s image`}
                      source={{ uri: user.image ?? undefined }}
                    />
                    <View className="flex flex-col gap-1">
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
                <View className="flex flex-1 flex-col gap-4">
                  <Text className="text-lg font-semibold">
                    {userId == currentUserData?.user.id && 'Your '}Ratings
                  </Text>
                  <View className="flex flex-row">
                    {RATING_CATEGORIES.map(({ key, label, color }) => (
                      <VerticalRatingBar key={key} value={user[key]} color={color} label={label} />
                    ))}
                  </View>
                  <Separator />
                </View>
                <View className="flex flex-1 flex-col gap-4">
                  <Text className="text-lg font-semibold">Rating History</Text>
                  {user.ratingHistory.length > 0 ? (
                    <LineChart
                      isAnimated
                      hideYAxisText
                      height={56}
                      thickness={2}
                      color={THEME[colorScheme!].primary}
                      dataPointsColor={THEME[colorScheme!].primary}
                      dataPointsRadius={2.5}
                      hideRules
                      xAxisThickness={0}
                      yAxisThickness={0}
                      spacing={96}
                      scrollToIndex={getHighestOvr()}
                      dataPointLabelShiftY={-14}
                      dataPointLabelShiftX={8}
                      yAxisOffset={45}
                      xAxisLabelTextStyle={{
                        color: THEME[colorScheme!].mutedForeground,
                        fontWeight: 500,
                        width: 96,
                        marginLeft: 32,
                        fontSize: 12,
                      }}
                      maxValue={99}
                      data={user.ratingHistory.map((entry) => ({
                        value: entry.overall,
                        label: timeAgo(entry.createdAt),
                        dataPointLabelComponent: () => (
                          <Text className="text-xs font-medium text-muted-foreground">
                            {entry.overall}
                          </Text>
                        ),
                      }))}
                    />
                  ) : (
                    <Text className="text-center text-xs font-medium">No ratings data yet.</Text>
                  )}
                  <Separator />
                </View>
                <View className="flex flex-col gap-4">
                  <Text className="text-lg font-semibold">Recent Sessions</Text>
                  {user.recentSessions.length > 0 ? (
                    <View className="flex flex-col gap-4">
                      {user.recentSessions.map((recentSession) => (
                        <RecentSessionCard session={recentSession} />
                      ))}
                    </View>
                  ) : (
                    <Text className="text-center text-xs font-medium">No sessions yet.</Text>
                  )}
                </View>
                {user.id === currentUserData?.user.id && (
                  <View className="flex flex-1 flex-col gap-4">
                    <Text className="text-lg font-semibold">Settings</Text>
                    <Button
                      variant="destructive"
                      onPress={() => authClient.signOut()}
                      className="justify-start">
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
