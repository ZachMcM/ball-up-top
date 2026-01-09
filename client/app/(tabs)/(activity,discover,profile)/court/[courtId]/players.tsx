import { NativewindFlatList } from '@/components/NativewindFlatList';
import { useLocation } from '@/components/providers/LocationProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import UserItem from '@/components/UserItem';
import { getCourt, getCourtActivePlayers } from '@/lib/endpoints';
import { getInitials } from '@/lib/utils';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
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

  const { location } = useLocation();

  const { data: court } = useQuery({
    queryFn: async () =>
      getCourt(courtId, {
        lat: location?.coords.latitude!,
        lng: location?.coords.longitude!,
      }),
    queryKey: ['court', courtId],
  });

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

function UserCard({ user }: { user: User }) {
  return (
    <Link href={`/user/${user.id}` as any} className="w-full">
      <View className="flex w-full flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2">
          <Avatar className="size-10" alt={`${user.name}'s image`}>
            <AvatarImage source={{ uri: user.image }} />
            <AvatarFallback>
              <Text>{getInitials(user.name)}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex flex-col">
            <Text className="text-sm font-semibold">{user.name}</Text>
            <Text className="text-xs font-medium text-muted-foreground">{user.archetype}</Text>
          </View>
        </View>
        <View className="flex size-9 items-center justify-center rounded-full border border-border bg-muted/30">
          <Text className="font-bold">{user.overall}</Text>
        </View>
      </View>
    </Link>
  );
}
