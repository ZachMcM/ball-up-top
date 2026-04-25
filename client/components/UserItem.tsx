import { useTabContext } from '@/hooks/useTabContext';
import { cn } from '@/lib/utils';
import { User } from '@/types/user';
import { Link } from 'expo-router';
import { View, ViewProps } from 'react-native';
import { Avatar } from './ui/avatar';
import { Text } from './ui/text';

export default function UserItem({ user, className, children, ...props }: { user: User } & ViewProps) {
  const tabContext = useTabContext();

  return (
    <Link
      href={{
        pathname: `/(tabs)/(${tabContext})/user/[userId]` as const,
        params: { userId: user.id },
      }}
      className="w-full">
      <View
        className={cn('flex w-full flex-row items-center justify-between', className)}
        {...props}>
        <View className="flex flex-row items-center gap-3">
          {children}
          <Avatar className="size-12" alt={`${user.name}'s image`} source={{ uri: user.image }} />
          <View className="flex flex-col">
            <Text className="font-semibold">{user.name}</Text>
            <Text className="text-sm font-medium text-muted-foreground">
              {user.height} • {user.archetype}
            </Text>
          </View>
        </View>
        <View className="flex flex-col items-center">
          <Text className="text-xl font-extrabold">{user.overall}</Text>
          <Text className="text-xs font-medium text-muted-foreground">OVR</Text>
        </View>
      </View>
    </Link>
  );
}
