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
import { Text } from '@/components/ui/text';
import { getCourts } from '@/lib/endpoints';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { PlusCircle } from 'lucide-react-native';
import { useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { useDebounce } from 'use-debounce';

interface CourtsListProps {
  searchQuery?: string;
  isIndoor?: boolean;
  isBookmarked?: true;
  isPopular?: true;
  sortBy?: 'distance' | 'activeCount';
}

export function CourtsList({
  searchQuery,
  isIndoor,
  isBookmarked,
  isPopular,
  sortBy,
}: CourtsListProps) {
  const { location, isLocationPending } = useLocation();
  const [debouncedSearchQuery] = useDebounce(searchQuery, 250);

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

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (sortedCourts.length === 0) {
    return (
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
    );
  }

  return (
    <NativewindFlatList
      contentContainerClassName="flex flex-col gap-4 pb-32"
      data={sortedCourts}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <CourtCard court={item} />}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}
