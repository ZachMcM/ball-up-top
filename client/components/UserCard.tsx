import { getInitials } from '@/lib/utils';
import { PlayerListEntry, User } from '@/types/user';
import { Link } from 'expo-router';
import { View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';
import { Text } from './ui/text';

export default function UserCard({ user }: { user: User | PlayerListEntry }) {
  const sessionsCount = 'sessionsCount30Days' in user ? user.sessionsCount30Days : undefined;

  return (
    <Link href={`/user/${user.id}` as any} className="w-full">
      <Card className="flex w-full flex-row items-center justify-between px-4 py-3">
        <View className="flex flex-row items-center gap-3">
          <Avatar className="size-12" alt={`${user.name}'s image`}>
            <AvatarImage source={{ uri: user.image }} />
            <AvatarFallback>
              <Text>{getInitials(user.name)}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex flex-col">
            <Text className="font-semibold">{user.name}</Text>
            <Text className="text-sm font-medium text-muted-foreground">
              {user.height} • {user.archetype}
            </Text>
            {sessionsCount !== undefined && (
              <Text className="text-xs font-medium text-muted-foreground">
                {sessionsCount} session{sessionsCount !== 1 ? 's' : ''} (30d)
              </Text>
            )}
          </View>
        </View>
        <View className="flex flex-col items-center">
          <Text className="text-lg font-bold">{user.overall}</Text>
          <Text className="text-xs font-medium text-muted-foreground">Overall</Text>
        </View>
      </Card>
    </Link>
  );
}
