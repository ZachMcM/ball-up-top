import { NativewindFlatList } from '@/components/NativewindFlatList';
import UserCard from '@/components/UserCard';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { getPlayers } from '@/lib/endpoints';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native';
import { useDebounce } from 'use-debounce';

interface PlayersListProps {
  searchQuery?: string;
  archetypes?: string[];
  minHeight?: number;
  maxHeight?: number;
  minOverall?: number;
  sortBy?: 'most_active' | 'overall_desc' | 'overall_asc';
}

export function PlayersList({
  searchQuery,
  archetypes,
  minHeight,
  maxHeight,
  minOverall,
  sortBy,
}: PlayersListProps) {
  const [debouncedSearchQuery] = useDebounce(searchQuery, 250);

  const { data: players, isPending: arePlayersPending } = useQuery({
    queryKey: [
      'discover',
      'players',
      {
        searchQuery: debouncedSearchQuery,
        archetypes,
        minHeight,
        maxHeight,
        minOverall,
        sortBy,
      },
    ],
    queryFn: async () => {
      const players = await getPlayers({
        searchQuery: debouncedSearchQuery,
        archetypes,
        minHeight,
        maxHeight,
        minOverall,
        sortBy,
      });
      return players;
    },
    staleTime: 1000 * 60,
  });

  if (arePlayersPending) {
    return <ActivityIndicator />;
  }

  if (!players || players.length === 0) {
    return (
      <Empty className="border border-dashed border-border">
        <EmptyHeader>
          <EmptyTitle>No Players Found</EmptyTitle>
          <EmptyDescription>
            No players match your search criteria. Try adjusting your filters.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <NativewindFlatList
      contentContainerClassName="flex flex-col gap-4 pb-32"
      data={players}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <UserCard user={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
