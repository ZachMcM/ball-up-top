import { cn, getInitials } from '@/lib/utils';
import { User } from '@/types/user';
import { Link } from 'expo-router';
import { View, ViewProps } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Text } from './ui/text';

export default function UserItem({ user, className, ...props }: { user: User } & ViewProps) {
  return (
    <Link
      href={{
        pathname: '/user/[userId]',
        params: { userId: user.id },
      }}
      className="w-full">
      <View
        className={cn('flex w-full flex-row items-center justify-between', className)}
        {...props}>
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
          </View>
        </View>
        <View className="flex flex-col items-center">
          <Text className="text-lg font-bold">{user.overall}</Text>
          <Text className="text-xs font-medium text-muted-foreground">Overall</Text>
        </View>
      </View>
    </Link>
  );
}
