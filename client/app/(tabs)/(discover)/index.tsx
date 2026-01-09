import { CourtsList } from '@/components/discover/CourtsList';
import { DiscoverFilters } from '@/components/discover/DiscoverFilters';
import { PlayersList } from '@/components/discover/PlayersList';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { SlidersHorizontal } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'courts' | 'players'>('courts');
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Courts filter state
  const [courtsFilters, setCourtsFilters] = useState<{
    isIndoor?: boolean;
    isBookmarked?: true;
    isPopular?: true;
    sortBy?: 'distance' | 'activeCount';
  }>({});

  // Players filter state
  const [playersFilters, setPlayersFilters] = useState<{
    minHeight?: string;
    maxHeight?: string;
    minOverall?: number;
    sortBy?: 'most_active' | 'overall_desc' | 'overall_asc';
  }>({});

  const activeFilterCount = useMemo(() => {
    if (activeTab === 'courts') {
      let count = 0;
      if (courtsFilters.isIndoor !== undefined) count++;
      if (courtsFilters.isBookmarked) count++;
      if (courtsFilters.isPopular) count++;
      if (courtsFilters.sortBy) count++;
      return count;
    } else {
      let count = 0;
      if (playersFilters.minHeight !== undefined || playersFilters.maxHeight !== undefined) count++;
      if (playersFilters.minOverall !== undefined) count++;
      if (playersFilters.sortBy) count++;
      return count;
    }
  }, [activeTab, courtsFilters, playersFilters]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <View className="flex w-full flex-col gap-4 px-4 py-6">
          <View className="flex w-full flex-row items-center justify-between rounded-full bg-muted/30 p-1">
            <Pressable
              onPress={() => setActiveTab('courts')}
              className={cn('flex-1 rounded-full p-2', activeTab == 'courts' && 'bg-secondary')}>
              <Text className="text-center font-semibold text-sm">Courts</Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('players')}
              className={cn('flex-1 rounded-full p-2', activeTab == 'players' && 'bg-secondary')}>
              <Text className="text-center font-semibold text-sm">Players</Text>
            </Pressable>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Input
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 rounded-full"
              placeholder={`Search for ${activeTab}...`}
            />
            <Button
              onPress={() => bottomSheetModalRef.current?.present()}
              variant="outline"
              size="icon"
              className="relative size-10 rounded-full">
              <Icon as={SlidersHorizontal} size={18} />
              {activeFilterCount > 0 && (
                <View className="absolute -right-1 -top-1 size-5 items-center justify-center rounded-full bg-primary">
                  <Text className="text-xs font-semibold !text-primary-foreground">
                    {activeFilterCount}
                  </Text>
                </View>
              )}
            </Button>
          </View>
          {activeTab === 'courts' ? (
            <CourtsList searchQuery={searchQuery} {...courtsFilters} />
          ) : (
            <PlayersList searchQuery={searchQuery} {...playersFilters} />
          )}
        </View>
      </KeyboardAvoidingView>
      <DiscoverFilters
        activeTab={activeTab as 'courts' | 'players'}
        bottomSheetRef={bottomSheetModalRef}
        courtsFilters={courtsFilters}
        onCourtsFiltersChange={setCourtsFilters}
        playersFilters={playersFilters}
        onPlayersFiltersChange={setPlayersFilters}
      />
    </>
  );
}
