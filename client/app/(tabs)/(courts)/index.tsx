import CourtCard from '@/components/CourtCard';
import { NativewindFlatList } from '@/components/NativewindFlatList';
import { useLocation } from '@/components/providers/LocationProvider';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { getCourts } from '@/lib/endpoints';
import { THEME } from '@/lib/theme';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  CheckIcon,
  FilterIcon,
  HomeIcon,
  PlusCircle,
  SlidersHorizontal,
  SunIcon,
  XIcon,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { useDebounce } from 'use-debounce';

export default function CourtsPage() {
  const { location, isLocationPending } = useLocation();
  const { colorScheme } = useColorScheme();

  // Applied filter state
  const [isIndoor, setIsIndoor] = useState<boolean | undefined>(undefined);
  const [isBookmarked, setIsBookmarked] = useState<true | undefined>(undefined);
  const [isPopular, setIsPopular] = useState<true | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'distance' | 'activeCount' | undefined>(undefined);

  // Temporary filter state (for bottom sheet)
  const [tempIsIndoor, setTempIsIndoor] = useState<boolean | undefined>(undefined);
  const [tempIsBookmarked, setTempIsBookmarked] = useState<true | undefined>(undefined);
  const [tempIsPopular, setTempIsPopular] = useState<true | undefined>(undefined);
  const [tempSortBy, setTempSortBy] = useState<'distance' | 'activeCount' | undefined>(undefined);

  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 250);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModal = useCallback(() => {
    // Sync temp state with current applied state when opening
    setTempIsIndoor(isIndoor);
    setTempIsBookmarked(isBookmarked);
    setTempIsPopular(isPopular);
    setTempSortBy(sortBy);
    bottomSheetModalRef.current?.present();
  }, [isIndoor, isBookmarked, isPopular, sortBy]);

  const handleDismissModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleApplyFilters = useCallback(() => {
    setIsIndoor(tempIsIndoor);
    setIsBookmarked(tempIsBookmarked);
    setIsPopular(tempIsPopular);
    setSortBy(tempSortBy);
    bottomSheetModalRef.current?.dismiss();
  }, [tempIsIndoor, tempIsBookmarked, tempIsPopular, tempSortBy]);

  const handleResetFilters = useCallback(() => {
    setTempIsIndoor(undefined);
    setTempIsBookmarked(undefined);
    setTempIsPopular(undefined);
    setTempSortBy(undefined);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.7} />
    ),
    []
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (isIndoor !== undefined) count++;
    if (isBookmarked) count++;
    if (isPopular) count++;
    if (sortBy) count++;
    return count;
  }, [isIndoor, isBookmarked, isPopular, sortBy]);

  const { data: courts, isPending: areCourtsPending } = useQuery({
    queryKey: [
      'courts',
      {
        lat: location?.coords.latitude!,
        lng: location?.coords.longitude!,
        isIndoor,
        isBookmarked,
        isPopular,
        searchQuery: debouncedSearchQuery,
      },
    ],
    queryFn: async () => {
      const courts = await getCourts({
        lat: location?.coords.latitude!,
        lng: location?.coords.longitude!,
        indoor: isIndoor,
        popular: isPopular,
        bookmarked: isBookmarked,
        searchQuery: debouncedSearchQuery,
      });
      return courts;
    },
    enabled: !!location,
    staleTime: 1000 * 60,
  });

  const sortedCourts = useMemo(() => {
    if (!courts) return [];
    if (!sortBy) return courts;
    return [...courts].sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distance - b.distance;
      }
      return b.currentActiveSessions - a.currentActiveSessions;
    });
  }, [courts, sortBy]);

  const isLoading = isLocationPending || areCourtsPending;

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <View className="flex w-full flex-col gap-4 px-4 py-6">
          <View className="flex flex-row items-center gap-2">
            <Input
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 rounded-full"
              placeholder="Search for courts..."
            />
            <Button
              onPress={handlePresentModal}
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
          {isLoading ? (
            <ActivityIndicator />
          ) : sortedCourts.length !== 0 ? (
            <NativewindFlatList
              contentContainerClassName="flex flex-col gap-4 pb-32"
              data={sortedCourts}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => <CourtCard court={item} />}
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            <Empty className="border border-dashed border-border">
              <EmptyHeader>
                <EmptyTitle>No Courts Found</EmptyTitle>
                <EmptyDescription>
                  No courts found nearby. Try a different search or adding a new court.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onPress={() => router.navigate('/add-court')}>
                  <Text>Add Court</Text>
                  <Icon size={16} className="text-primary-foreground" as={PlusCircle} />
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </View>
      </KeyboardAvoidingView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backdropComponent={renderBackdrop}
        enableDynamicSizing
        backgroundStyle={{
          backgroundColor: THEME[colorScheme!].background,
        }}
        handleIndicatorStyle={{ backgroundColor: THEME[colorScheme!].muted }}>
        <BottomSheetScrollView className="flex flex-1 flex-col">
          <View className="flex flex-row items-center justify-between border-b border-border px-4 py-4">
            <Pressable className='flex-1' onPress={handleDismissModal}>
              <Text className="text-base font-medium text-left">Close</Text>
            </Pressable>
            <Text className="text-lg font-semibold flex-1 text-center">Filters</Text>
            <Pressable className='flex-1' onPress={handleResetFilters}>
              <Text className="text-base font-medium text-primary text-right">Reset</Text>
            </Pressable>
          </View>
          <View className="flex flex-col gap-4 border-b border-border px-4 py-5">
            <Text className="text-lg font-bold">Court Type</Text>
            <View className="flex flex-row gap-2">
              <Button
                onPress={() => setTempIsIndoor(tempIsIndoor === true ? undefined : true)}
                variant={tempIsIndoor === true ? 'secondary' : 'outline'}
                className="flex-1">
                <Icon as={HomeIcon} size={16} />
                <Text>Indoor</Text>
              </Button>
              <Button
                onPress={() => setTempIsIndoor(tempIsIndoor === false ? undefined : false)}
                variant={tempIsIndoor === false ? 'secondary' : 'outline'}
                className="flex-1">
                <Icon as={SunIcon} size={16} />
                <Text>Outdoor</Text>
              </Button>
            </View>
          </View>
          <View className="flex flex-col gap-2 border-b border-border px-4 py-5">
            <Text className="text-lg font-bold">Filters</Text>
            <Pressable
              onPress={() => setTempIsPopular(tempIsPopular ? undefined : true)}
              className="flex flex-row items-center justify-between py-3">
              <Text className="text-base">Popular</Text>
              <View
                className={`size-6 items-center justify-center rounded-md border-2 ${
                  tempIsPopular ? 'border-primary bg-primary' : 'border-muted-foreground'
                }`}>
                {tempIsPopular && <Icon as={CheckIcon} size={16} className="text-primary-foreground" />}
              </View>
            </Pressable>
            <Pressable
              onPress={() => setTempIsBookmarked(tempIsBookmarked ? undefined : true)}
              className="flex flex-row items-center justify-between py-3">
              <Text className="text-base">Bookmarked</Text>
              <View
                className={`size-6 items-center justify-center rounded-md border-2 ${
                  tempIsBookmarked ? 'border-primary bg-primary' : 'border-muted-foreground'
                }`}>
                {tempIsBookmarked && <Icon as={CheckIcon} size={16} className="text-primary-foreground" />}
              </View>
            </Pressable>
          </View>
          <View className="flex flex-col gap-2 px-4 py-5">
            <Text className="text-lg font-bold">Sort</Text>
            <Pressable
              onPress={() => setTempSortBy(tempSortBy === 'distance' ? undefined : 'distance')}
              className="flex flex-row items-center justify-between py-3">
              <Text className="text-base">Distance</Text>
              <View
                className={`size-6 items-center justify-center rounded-full border-2 ${
                  tempSortBy === 'distance' ? 'border-primary' : 'border-muted-foreground'
                }`}>
                {tempSortBy === 'distance' && (
                  <View className="size-3.5 rounded-full bg-primary" />
                )}
              </View>
            </Pressable>
            <Pressable
              onPress={() => setTempSortBy(tempSortBy === 'activeCount' ? undefined : 'activeCount')}
              className="flex flex-row items-center justify-between py-3">
              <Text className="text-base">Most Players</Text>
              <View
                className={`size-6 items-center justify-center rounded-full border-2 ${
                  tempSortBy === 'activeCount' ? 'border-primary' : 'border-muted-foreground'
                }`}>
                {tempSortBy === 'activeCount' && (
                  <View className="size-3.5 rounded-full bg-primary" />
                )}
              </View>
            </Pressable>
          </View>
          <View className="px-4 pb-8 pt-2">
            <Button onPress={handleApplyFilters} size="lg" className="w-full">
              <Text>Apply</Text>
            </Button>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}
