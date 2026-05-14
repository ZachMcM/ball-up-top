import { NativewindScrollView } from '@/components/NativewindScrollView';
import { ArchetypeDisplay } from '@/components/design/ArchetypeDisplay';
import { OVRDisplay } from '@/components/design/OVRDisplay';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VerticalRatingBar } from '@/components/ui/vertical-rating-bar';
import { authClient } from '@/lib/auth-client';
import { getUser } from '@/lib/endpoints';
import { Share } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function ProfilePage() {
  const searchParams = useLocalSearchParams();
  const { userId } = searchParams as { userId: string };

  const { data: user, isPending } = useQuery({
    queryFn: async () => getUser(userId),
    queryKey: ['user', userId],
  });

  const { data: currentUserData } = authClient.useSession();
  const isOwnProfile = currentUserData?.user.id === userId;

  const handleShareProfile = () => {
    // TODO: Implement react-native-skia share image generation
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: user?.name ?? 'Profile',
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
            contentContainerClassName="flex w-full flex-col px-4 py-6 gap-6">
            {/* Identity Block */}
            <View className="flex flex-row items-center gap-3">
              <Avatar
                className="size-12"
                alt={`${user.name}'s profile`}
                source={{ uri: user.image ?? undefined }}
              />
              <View>
                <Text className="text-[17px] font-extrabold tracking-tight">
                  {user.name}
                </Text>
                <Text className="mt-0.5 text-xs font-semibold text-muted-foreground underline decoration-border underline-offset-2">
                  At {user.primaryCollegeName}
                </Text>
              </View>
            </View>

            {/* Hero Block: OVR + Meta */}
            <View className="flex flex-row items-start gap-6">
              <OVRDisplay value={user.overall} size="xl" />
              <View className="flex flex-col justify-center">
                <ArchetypeDisplay
                  archetype={user.archetype}
                  variant="hero"
                  size="md"
                />
                {user.rank && (
                  <View className="mt-1 flex flex-row items-baseline gap-1.5">
                    <Text className="font-bebas text-3xl tracking-tight">
                      #{user.rank}
                    </Text>
                    <Text className="text-sm font-semibold text-muted-foreground">
                      at {user.primaryCollegeName}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Share CTA */}
            <Button onPress={handleShareProfile} className="h-12 -mt-8 rounded-xl">
              <Share size={16} className="text-primary-foreground" />
              <Text className="text-[15px] font-bold text-primary-foreground">
                Share Your Profile
              </Text>
            </Button>

            {/* Skill Breakdown */}
            <View className="flex flex-col gap-3">
              <Text className="text-sm font-semibold text-muted-foreground">
                Skill Breakdown
              </Text>
              <View className="flex flex-row items-end justify-between gap-2.5">
                <VerticalRatingBar label="Finishing" value={user.finishingRating} />
                <VerticalRatingBar label="Playmaking" value={user.playmakingRating} />
                <VerticalRatingBar label="Defense" value={user.defenseRating} />
                <VerticalRatingBar label="Shooting" value={user.shootingRating} />
              </View>
            </View>
          </NativewindScrollView>
        )
      )}
    </>
  );
}
