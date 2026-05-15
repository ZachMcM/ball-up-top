import { ArchetypeDisplay } from '@/components/design/ArchetypeDisplay';
import { DeltaIndicator } from '@/components/design/DeltaIndicator';
import { OVRDisplay } from '@/components/design/OVRDisplay';
import { NativewindScrollView } from '@/components/NativewindScrollView';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { getHome } from '@/lib/endpoints';
import { cn } from '@/lib/utils';
import { HomeCourt } from '@/types/home';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

export default function HomePage() {
  const { data: home, isPending } = useQuery({
    queryKey: ['home'],
    queryFn: () => getHome(),
  });

  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" className="text-muted-foreground" />
        </View>
      ) : (
        home && (
          <NativewindScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerClassName="flex w-full flex-col gap-4 py-6"
            keyboardShouldPersistTaps="handled">
            <View className="flex flex-col px-4 pb-4">
              <Text className="text-xs font-medium text-muted-foreground">Welcome Back,</Text>
              <Text className="text-lg font-bold">{home.userData.name}</Text>
            </View>
            <View className="flex flex-row items-start justify-between gap-4 px-4">
              <OVRDisplay value={home.userData.overall} size="md" />
              <View className="flex flex-1 flex-col">
                <ArchetypeDisplay archetype={home.userData.archetype} variant="hero" size="md" />
                {home.userData.rank ? (
                  <View className="flex flex-row items-center gap-2">
                    <Text className="font-bebas text-xl tabular-nums leading-[36px]">
                      #{home.userData.rank}
                    </Text>
                    <View className="flex flex-row items-center gap-1">
                      <Text className="text-[13px] font-semibold text-muted-foreground">
                        At {home.primaryCollege.name}
                      </Text>
                      <DeltaIndicator value={home.userData.rankDelta} size="sm" />
                    </View>
                  </View>
                ) : (
                  <Text className="max-w-48 text-sm font-semibold text-muted-foreground">
                    Unranked at {home.primaryCollege.name}
                  </Text>
                )}
              </View>
            </View>

            <View className="flex flex-col gap-4">
              <View className="flex flex-col gap-0.5 px-4">
                <Text className="text-[16px] font-semibold">{home.primaryCollege.name} Courts</Text>
                <Text className="text-sm font-medium text-muted-foreground">
                  {(() => {
                    const live = home.courts.filter((c) => c.activePlayerCount > 0).length;
                    const quiet = home.courts.length - live;
                    if (live === 0) return `${quiet} Quiet`;
                    if (quiet === 0) return `${live} Live`;
                    return `${live} Live • ${quiet} Quiet`;
                  })()}
                </Text>
              </View>
              <View className="flex flex-col">
                {[...home.courts]
                  .sort((a, b) => b.activePlayerCount - a.activePlayerCount)
                  .map((c, i) => (
                    <CourtRow
                      key={c.id}
                      court={c}
                      isFirst={i === 0}
                      onPress={() =>
                        router.push({
                          pathname: '/(tabs)/(home)/court/[courtId]/active-players',
                          params: { courtId: c.id },
                        })
                      }
                    />
                  ))}
              </View>
            </View>
          </NativewindScrollView>
        )
      )}
    </KeyboardAvoidingView>
  );
}

function CourtRow({
  court,
  isFirst,
  onPress,
}: {
  court: HomeCourt;
  isFirst: boolean;
  onPress: () => void;
}) {
  const hasPlayers = court.activePlayerCount > 0;
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex flex-row items-center justify-between border-b border-border px-4',
        hasPlayers ? 'py-4' : 'py-3.5',
        isFirst && 'border-t'
      )}>
      <View className="flex flex-1 flex-col gap-1">
        <Text
          className={cn(
            hasPlayers ? 'text-[16px] font-semibold' : 'font-medium text-muted-foreground'
          )}>
          {court.name}
        </Text>
        {hasPlayers ? (
          <View className="flex flex-row items-center gap-1.5">
            <View className="size-2 rounded-full bg-green-400" />
            <Text className="text-sm font-semibold text-green-400">
              {court.activePlayerCount} playing
            </Text>
          </View>
        ) : (
          <Text className="text-xs text-muted-foreground">No one playing</Text>
        )}
      </View>
      <View className="flex flex-row items-center gap-2">
        {hasPlayers && <AvatarStack players={court.activePlayers} />}
        <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
      </View>
    </Pressable>
  );
}

function AvatarStack({ players }: { players: HomeCourt['activePlayers'] }) {
  if (players.length === 0) return null;
  return (
    <View className="flex flex-row">
      {players.slice(0, 3).map((p, i) => (
        <Avatar
          key={p.id}
          className={cn('size-9 border-2 border-background', i > 0 && '-ml-2')}
          alt={p.name}
          source={{ uri: p.image ?? undefined }}
        />
      ))}
    </View>
  );
}
