import { NativewindScrollView } from '@/components/NativewindScrollView';
import { DeltaIndicator } from '@/components/design';
import { ArchetypeDisplay } from '@/components/design/ArchetypeDisplay';
import { OVRDisplay } from '@/components/design/OVRDisplay';
import { OverallHistoryGraph } from '@/components/design/OverallHistoryGraph';
import { Avatar } from '@/components/ui/avatar';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VerticalRatingBar } from '@/components/ui/vertical-rating-bar';
import { getUser } from '@/lib/endpoints';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { BanIcon, ShareIcon } from 'lucide-react-native';
import { ActivityIndicator, Pressable, Share, View } from 'react-native';

export default function ProfilePage() {
  const searchParams = useLocalSearchParams();
  const { userId } = searchParams as { userId: string };

  const { data: user, isPending } = useQuery({
    queryFn: async () => getUser(userId),
    queryKey: ['user', userId],
  });

  const handleShareProfile = async () => {
    // TODO fix in dev version
    try {
      await Share.share({
        title: `Ball Up Top`,
        url: `ball-up-top-client://user/${userId}`,
        message: `Check out ${user?.name}'s Ball Up Top profile!`,
      });
    } catch (error) {
      // TODO
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={handleShareProfile}>
              <Icon size={22} as={ShareIcon} />
            </Pressable>
          ),
        }}
      />
      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        user && (
          <NativewindScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerClassName="flex w-full flex-col px-4 pt-6 pb-8">
            <View className="flex flex-col gap-8">
              <View className="flex flex-row items-center gap-3">
                <Avatar
                  className="size-14"
                  alt={`${user.name}'s profile`}
                  source={{ uri: user.image ?? undefined }}
                />
                <View className="flex flex-col">
                  <Text className="text-lg font-bold tracking-tight">{user.name}</Text>
                  <Text className="text-sm font-semibold text-muted-foreground">
                    {user.primaryCollegeName}
                  </Text>
                </View>
              </View>
              <View className="flex flex-row items-start justify-between gap-6">
                <OVRDisplay value={user.overall} size="lg" />
                <View className="flex flex-1 flex-col justify-center gap-2">
                  <ArchetypeDisplay archetype={user.archetype} variant="hero" size="lg" />
                  {user.rank ? (
                    <View className="flex flex-row items-center gap-2">
                      <Text className="font-bebas text-4xl tabular-nums leading-[54px]">
                        #{user.rank}
                      </Text>
                      <View className="flex flex-row items-center gap-1">
                        <Text className="text-[13px] font-semibold text-muted-foreground">
                          At {user.primaryCollegeName}
                        </Text>
                        <DeltaIndicator value={user.rankDelta} size="sm" />
                      </View>
                    </View>
                  ) : (
                    <Text className="text-sm font-semibold text-muted-foreground">
                      Unranked at {user.primaryCollegeName}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View className="flex flex-col gap-8">
              <View className="flex flex-col gap-4">
                <Text className="text-sm font-semibold text-muted-foreground">
                  Ratings Breakdown
                </Text>
                <View className="flex flex-row items-end justify-between gap-2.5">
                  <VerticalRatingBar label="Finishing" value={user.finishingRating} />
                  <VerticalRatingBar label="Playmaking" value={user.playmakingRating} />
                  <VerticalRatingBar label="Defense" value={user.defenseRating} />
                  <VerticalRatingBar label="Shooting" value={user.shootingRating} />
                </View>
              </View>
              <View className="flex flex-col">
                <Text className="text-sm font-semibold text-muted-foreground">Overall History</Text>
                {user.overallHistory.length === 0 ? (
                  <Empty className="border border-dashed border-border mt-6">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Icon size={22} as={BanIcon} className="text-primary-foreground" />
                      </EmptyMedia>
                      <EmptyTitle>No overall data</EmptyTitle>
                      <EmptyDescription>
                        Get out there and hoop to increase your overall!
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <OverallHistoryGraph points={user.overallHistory} />
                )}
              </View>
            </View>
          </NativewindScrollView>
        )
      )}
    </>
  );
}
