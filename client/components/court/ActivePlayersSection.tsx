import UserItem from '@/components/UserItem';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useTabContext } from '@/hooks/useTabContext';
import { User } from '@/types/user';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

export function ActivePlayersSection({
  courtId,
  currentActiveSessions,
  currentActiveUsers,
}: {
  courtId: number;
  currentActiveSessions: number;
  currentActiveUsers: User[];
}) {
  const router = useRouter();
  const tabContext = useTabContext();

  return (
    <View className="flex flex-1 flex-col gap-4">
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2">
          {currentActiveSessions !== 0 && (
            <View className="size-2 animate-pulse rounded-full bg-green-500" />
          )}
          <Text className="font-semibold">{currentActiveSessions} Active Players</Text>
        </View>
        {currentActiveSessions > currentActiveUsers.length && (
          <Pressable
            className="flex flex-row items-center gap-1"
            onPress={() =>
              router.push({
                pathname: `/(tabs)/(${tabContext})/court/[courtId]/players` as const,
                params: { courtId },
              })
            }>
            <Text className="text-sm font-medium text-muted-foreground">See All</Text>
            <Icon as={ChevronRight} className="text-muted-foreground" size={16} />
          </Pressable>
        )}
      </View>
      {currentActiveSessions !== 0 ? (
        <View className="flex flex-col gap-3">
          {currentActiveUsers.map((user, i) => (
            <UserItem key={i} user={user} />
          ))}
        </View>
      ) : (
        <Text className="text-center text-sm font-medium text-muted-foreground">
          No active runs currently.
        </Text>
      )}
    </View>
  );
}
