import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { CourtsFiltersContent } from './CourtsFiltersContent';
import { PlayersFiltersContent } from './PlayersFiltersContent';

interface DiscoverFiltersProps {
  activeTab: 'courts' | 'players';
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;

  courtsFilters: {
    isIndoor?: boolean;
    sortBy?: 'distance' | 'active_players';
  };
  onCourtsFiltersChange: (filters: DiscoverFiltersProps['courtsFilters']) => void;

  playersFilters: {
    minHeight?: string;
    maxHeight?: string;
    minOverall?: number;
    sortBy?: 'most_active' | 'overall_desc' | 'overall_asc';
  };
  onPlayersFiltersChange: (filters: DiscoverFiltersProps['playersFilters']) => void;
}

export function DiscoverFilters({
  activeTab,
  bottomSheetRef,
  courtsFilters,
  onCourtsFiltersChange,
  playersFilters,
  onPlayersFiltersChange,
}: DiscoverFiltersProps) {
  const { colorScheme } = useColorScheme();

  const [tempCourtsFilters, setTempCourtsFilters] = useState(courtsFilters);
  const [tempPlayersFilters, setTempPlayersFilters] = useState(playersFilters);

  // Sync temp filters with applied filters when they change
  useEffect(() => {
    setTempCourtsFilters(courtsFilters);
  }, [courtsFilters]);

  useEffect(() => {
    setTempPlayersFilters(playersFilters);
  }, [playersFilters]);

  const handleDismissModal = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, [bottomSheetRef]);

  const handleApplyFilters = useCallback(() => {
    if (activeTab === 'courts') {
      onCourtsFiltersChange(tempCourtsFilters);
    } else {
      onPlayersFiltersChange(tempPlayersFilters);
    }
    bottomSheetRef.current?.dismiss();
  }, [
    activeTab,
    tempCourtsFilters,
    tempPlayersFilters,
    bottomSheetRef,
    onCourtsFiltersChange,
    onPlayersFiltersChange,
  ]);

  const handleResetFilters = useCallback(() => {
    if (activeTab === 'courts') {
      setTempCourtsFilters({});
    } else {
      setTempPlayersFilters({});
    }
  }, [activeTab]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.7} />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
      enableDynamicSizing
      backgroundStyle={{
        backgroundColor: THEME[colorScheme!].background,
      }}
      handleIndicatorStyle={{ backgroundColor: THEME[colorScheme!].muted }}>
      <BottomSheetScrollView className="flex flex-1 flex-col">
        <View className="flex flex-row items-center justify-between border-b border-border p-4">
          <Pressable className="flex-1" onPress={handleDismissModal}>
            <Text className="text-left text-base font-medium">Close</Text>
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold">Filters</Text>
          <Pressable className="flex-1" onPress={handleResetFilters}>
            <Text className="text-right text-base font-medium text-primary">Reset</Text>
          </Pressable>
        </View>

        {activeTab === 'courts' ? (
          <CourtsFiltersContent filters={tempCourtsFilters} onChange={setTempCourtsFilters} />
        ) : (
          <PlayersFiltersContent filters={tempPlayersFilters} onChange={setTempPlayersFilters} />
        )}

        <View className="px-4 pb-8 pt-2">
          <Button onPress={handleApplyFilters} size="lg" className="w-full">
            <Text>Apply</Text>
          </Button>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
