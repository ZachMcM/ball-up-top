import { useTabContext } from '@/hooks/useTabContext';
import { cn } from '@/lib/utils';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { RefObject, useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { Avatar } from '../ui/avatar';
import { Icon } from '../ui/icon';
import { Text } from '../ui/text';
import { ArchetypePill } from './ArchetypePill';
import { OVRDisplay } from './OVRDisplay';

type ActivePlayer = {
  userId: string;
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

  const renderPlayer = ({ item }: any) => (
    <Pressable
      onPress={() => handlePlayerPress(item.userId)}
      className="flex flex-row items-center gap-3 border-b border-border px-4 py-3">
      <View className="relative">
        <Avatar className="size-10" alt={item.name} source={{ uri: item.image ?? undefined }} />
        <View className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-card bg-green-400" />
      </View>
      <View className="flex-1">
        <Text className="font-semibold">{item.name}</Text>
        <ArchetypePill archetype={item.archetype} tone="ghost" size="sm" className="mt-1" />
      </View>
      <OVRDisplay value={item.overall} size="sm" />
    </Pressable>
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={['70%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#141414' }}
      handleIndicatorStyle={{ backgroundColor: '#a3a3a3' }}>
      <BottomSheetView className="flex-1 px-4">
        <View className="mb-4">
          <Text className="text-lg font-bold">
            {courtName ? `Active at ${courtName}` : 'Active Players'}
          </Text>
          <Text className="text-sm text-muted-foreground">{players.length} players live</Text>
        </View>

        <View className="mb-4 flex flex-row items-center gap-3 rounded-full bg-muted/50 px-4 py-2">
          <Icon as={Search} size={18} className="text-muted-foreground" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search players..."
            placeholderTextColor="#a3a3a3"
            className="flex-1 text-foreground"
          />
        </View>

        <FlatList
          data={filteredPlayers}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.userId}
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
