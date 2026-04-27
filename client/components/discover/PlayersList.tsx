import { NativewindFlatList } from '@/components/NativewindFlatList';
import UserItem from '@/components/UserItem';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { getUsers } from '@/lib/endpoints';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native';
import { useDebounce } from 'use-debounce';

interface PlayersListProps {
  searchQuery?: string;
  minHeight?: string;
  maxHeight?: string;
  minOverall?: number;
  sortBy?: 'most_active' | 'overall_desc' | 'overall_asc';
}

export function PlayersList({
  searchQuery,
  minHeight,
  maxHeight,
  minOverall,
  sortBy,
}: PlayersListProps) {
  const [debouncedSearchQuery] = useDebounce(searchQuery, 250);

  const { data: players, isPending: arePlayersPending } = useQuery({
    queryKey: [
      'players',
      {
        searchQuery: debouncedSearchQuery,
        minHeight,
        maxHeight,
        minOverall,
        sortBy,
      },
    ],
    queryFn: async () => {
      const players = await getUsers({
        searchQuery: debouncedSearchQuery,
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
      contentContainerClassName="flex flex-col gap-6 pb-32"
      data={players}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <UserItem user={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
