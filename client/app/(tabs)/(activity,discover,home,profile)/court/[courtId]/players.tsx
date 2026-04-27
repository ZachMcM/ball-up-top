import { NativewindFlatList } from '@/components/NativewindFlatList';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import UserItem from '@/components/UserItem';
import { getCourtActivePlayers } from '@/lib/endpoints';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';

export default function CourtPlayersPage() {
  const searchParams = useLocalSearchParams();
  const courtId = parseInt(searchParams.courtId as string);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  const { data: users, isPending } = useQuery({
    queryFn: async () => getCourtActivePlayers(courtId),
    queryKey: ['court', courtId, 'active-players'],
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchQuery?.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) || user.archetype.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <View className="flex w-full flex-col gap-6 px-4 py-6">
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="rounded-full"
          placeholder="Search for players..."
        />
        {isPending ? (
          <ActivityIndicator />
        ) : filteredUsers.length !== 0 ? (
          <NativewindFlatList
            contentContainerClassName="flex flex-col gap-6 pb-32"
            data={filteredUsers}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <UserItem user={item} />}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Empty className="border border-dashed border-border">
            <EmptyHeader>
              <EmptyTitle>No Players Found</EmptyTitle>
              <EmptyDescription>
                {searchQuery?.trim()
                  ? 'No players match your search.'
                  : 'No players are currently at this court.'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
