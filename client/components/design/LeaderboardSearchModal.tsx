import { useTabContext } from '@/hooks/useTabContext';
import { authClient } from '@/lib/auth-client';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { UserEntry } from '@/types/court';
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

type LeaderboardSearchModalProps = {
  bottomSheetRef: RefObject<BottomSheetModal | null>;
  users: UserEntry[];
};

export function LeaderboardSearchModal({ bottomSheetRef, users }: LeaderboardSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const tabContext = useTabContext();
  const { colorScheme } = useColorScheme();
  const { data: currentUserData } = authClient.useSession();

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(q));
  }, [users, searchQuery]);

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

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={['75%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: THEME[colorScheme!].background,
      }}
      handleIndicatorStyle={{ backgroundColor: THEME[colorScheme!].muted }}
      onDismiss={() => setSearchQuery('')}>
      <BottomSheetView className="flex flex-1 flex-col gap-6">
        <View className="flex flex-col gap-0.5 px-4">
          <Text className="text-lg font-bold">Search All Players</Text>
          <Text className="text-sm font-medium text-muted-foreground">{users.length} players</Text>
        </View>
        <View className="px-4">
          <Input
            className="h-9 rounded-full"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search players..."
            autoCorrect={false}
          />
        </View>
        <NativewindFlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: user, index }) => (
            <Pressable
              onPress={() => handlePlayerPress(user.id)}
              className={cn(
                'flex flex-row items-center justify-between border-b border-border px-4 py-3',
                index === 0 && 'border-t',
                user.id === currentUserData?.user.id && 'bg-muted-foreground/10 dark:bg-card'
              )}>
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
                      <Text className="text-muted-foreground font-normal"> (You)</Text>
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
              <View className="flex flex-col items-center">
                <OVRDisplay value={user.overall} size="sm" />
                <Text className="text-[10px] font-medium tracking-tight text-muted-foreground">
                  OVR
                </Text>
              </View>
            </Pressable>
          )}
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
