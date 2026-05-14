import { useTabContext } from '@/hooks/useTabContext';
import { authClient } from '@/lib/auth-client';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { RefObject, useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { NativewindFlatList } from '../NativewindFlatList';
import { Avatar } from '../ui/avatar';
import { Input } from '../ui/input';
import { Text } from '../ui/text';
import { ArchetypeDisplay } from './ArchetypeDisplay';
import { OVRDisplay } from './OVRDisplay';

type ActivePlayer = {
  id: string;
  name: string;
  overall: number;
  archetype: string;
  image: string | null;
};

type ActivePlayersModalProps = {
  bottomSheetRef: RefObject<BottomSheetModal | null>;
  players: ActivePlayer[];
  courtName?: string;
};

export function ActivePlayersModal({
  bottomSheetRef,
  players,
  courtName,
}: ActivePlayersModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const tabContext = useTabContext();

  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return players;
    const query = searchQuery.toLowerCase();
    return players.filter(
      (p) => p.name.toLowerCase().includes(query) || p.archetype.toLowerCase().includes(query)
    );
  }, [players, searchQuery]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  const handlePlayerPress = (userId: string) => {
    bottomSheetRef.current?.dismiss();
    router.push({
      pathname: `/(tabs)/(${tabContext})/user/[userId]` as const,
      params: { userId },
    });
  };

  const { colorScheme } = useColorScheme();

  const { data: currentUserData } = authClient.useSession();

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={['70%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: THEME[colorScheme!].background }}
      handleIndicatorStyle={{ backgroundColor: THEME[colorScheme!].accent }}>
      <BottomSheetView className="flex flex-1 flex-col gap-6">
        <View className="flex flex-col gap-0.5 px-4">
          <Text className="text-lg font-bold">
            {courtName ? `Active at ${courtName}` : 'Active Players'}
          </Text>
          <Text className="text-sm font-medium text-muted-foreground">
            {players.length} players live
          </Text>
        </View>
        <View className="px-4">
          <Input
            className="h-9 rounded-full"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search players..."
          />
        </View>
        <NativewindFlatList
          data={filteredPlayers}
          renderItem={({ item: user, index }) => (
            <Pressable
              onPress={() => handlePlayerPress(user.id)}
              className={cn(
                'flex flex-row items-center justify-between border-b border-border px-4 py-3',
                index == 0 && 'border-t',
                user.id === currentUserData?.user.id && 'border-l-2 border-l-foreground bg-card'
              )}>
              <View className="flex flex-row items-center gap-3">
                <Avatar
                  className="size-10"
                  alt={user.name}
                  source={{ uri: user.image ?? undefined }}
                />
                <View className="flex flex-col gap-1">
                  <Text className="flex-1 font-semibold">
                    {user.name}
                    {user.id === currentUserData?.user.id && (
                      <Text className="text-muted-foreground"> (You)</Text>
                    )}
                  </Text>
                  <ArchetypeDisplay size="md" archetype={user.archetype} />
                </View>
              </View>
              <View className="flex flex-col items-center">
                <OVRDisplay size="sm" value={user.overall} />
                <Text className="text-[10px] font-medium tracking-tight text-muted-foreground">
                  OVR
                </Text>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-8">
              <Text className="text-muted-foreground">No players found</Text>
            </View>
          }
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}
