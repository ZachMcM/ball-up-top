import { ArchetypePill } from '@/components/design/ArchetypePill';
import { DeltaIndicator } from '@/components/design/DeltaIndicator';
import { OVRDisplay } from '@/components/design/OVRDisplay';
import { StatBar } from '@/components/design/StatBar';
import { NativewindScrollView } from '@/components/NativewindScrollView';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import { getUser } from '@/lib/endpoints';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { LogOutIcon, Settings, Share2 } from 'lucide-react-native';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

export default function ProfilePage() {
  const searchParams = useLocalSearchParams();
  const { userId } = searchParams as { userId: string };

  const { data: user, isPending } = useQuery({
    queryFn: async () => getUser(userId),
    queryKey: ['user', userId],
  });

  const { data: currentUserData } = authClient.useSession();
  const isOwnProfile = userId === currentUserData?.user.id;

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
          contentContainerClassName="flex w-full flex-col gap-6 px-4 py-6"
          keyboardShouldPersistTaps="handled">
          {isPending ? (
            <View className="flex-1 items-center justify-center pt-12">
              <ActivityIndicator />
            </View>
          ) : (
            user && (
              <>
                {/* Top Bar - Wordmark + Settings (own profile only) */}
                <View className="flex flex-row items-center justify-between">
                  <View className="flex flex-row items-center gap-2">
                    <View className="size-3.5 rounded-full border-2 border-foreground bg-foreground" />
                    <Text className="text-sm font-extrabold tracking-tight">Ball Up Top</Text>
                  </View>
                  {isOwnProfile && (
                    <Pressable className="p-1">
                      <Icon as={Settings} size={20} className="text-foreground" />
                    </Pressable>
                  )}
                </View>

                {/* Identity Block */}
                <View className="flex flex-row items-center gap-4">
                  <Avatar
                    className="size-14"
                    alt={`${user.name}'s image`}
                    source={{ uri: (user as any).image ?? undefined }}
                  />
                  <View className="flex flex-col gap-1">
                    <Text className="text-xl font-extrabold tracking-tight">{user.name}</Text>
                    <Text className="text-sm font-semibold text-muted-foreground underline decoration-border underline-offset-4">
                      {(currentUserData?.user as any)?.primaryCourt?.collegeName ?? 'Your Campus'}
                    </Text>
                  </View>
                </View>

                {/* OVR Display + Stats */}
                <View className="flex flex-row items-start gap-4">
                  <OVRDisplay value={user.overall} size="xl" />
                  <View className="flex flex-1 flex-col gap-3 pt-4">
                    <ArchetypePill archetype={user.archetype} tone="fill" size="md" />
                    <View className="flex flex-row items-center gap-2">
                      <Text className="text-2xl font-extrabold">#{user.rank ?? '—'}</Text>
                      <Text className="text-sm text-muted-foreground">on campus</Text>
                      <DeltaIndicator value={user.rankDelta} type="rank" size="md" />
                    </View>
                    <View className="flex flex-row items-center gap-3">
                      <View className="flex flex-row items-center gap-1">
                        <Text className="text-xs text-muted-foreground">OVR</Text>
                        <DeltaIndicator value={user.overallDelta} type="ovr" size="sm" />
                      </View>
                      <Text className="text-xs text-muted-foreground/70">
                        {user.height} · joined recently
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Share CTA */}
                <Button size="lg" className="h-14 rounded-2xl">
                  <Icon as={Share2} size={18} className="text-background" />
                  <Text className="font-bold">Share Your Archetype</Text>
                </Button>

                {/* Skill Breakdown */}
                <Card className="p-4">
                  <View className="flex flex-row items-center justify-between">
                    <Text className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Skill Breakdown
                    </Text>
                    <Text className="text-xs text-muted-foreground/70">vs. archetype avg</Text>
                  </View>
                  <View className="mt-4 flex flex-col gap-4">
                    <StatBar label="Shooting" value={user.shootingRating} />
                    <StatBar label="Finishing" value={user.finishingRating} />
                    <StatBar label="Playmaking" value={user.playmakingRating} />
                    <StatBar
                      label="Defense"
                      value={user.defenseRating}
                      accent={user.defenseRating < 60 ? 'bg-amber-500' : undefined}
                    />
                  </View>
                </Card>

                {/* Settings (own profile only) */}
                {isOwnProfile && (
                  <View className="flex flex-col gap-4">
                    <Separator />
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
