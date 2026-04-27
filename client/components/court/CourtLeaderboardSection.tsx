import UserItem from '@/components/UserItem';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useTabContext } from '@/hooks/useTabContext';
import { CourtLeaderboard } from '@/types/court';
import { useRouter } from 'expo-router';
import { ChevronRight, MoreHorizontal } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

export function CourtLeaderboardSection({
  courtId,
  leaderboard,
}: {
  courtId: number;
  leaderboard: CourtLeaderboard;
}) {
  const router = useRouter();
  const tabContext = useTabContext();
  const { top, currentUser } = leaderboard;

  return (
    <View className="flex flex-1 flex-col gap-4">
      <View className="flex flex-row items-center justify-between">
        <Text className="font-semibold">Court Leaderboard</Text>
        <Pressable
          className="flex flex-row items-center gap-1"
          onPress={() => {
            router.push({
              pathname: `/(tabs)/(${tabContext})/court/[courtId]/leaderboard` as const,
              params: { courtId },
            });
          }}>
          <Text className="text-sm font-medium text-muted-foreground">See All</Text>
          <Icon as={ChevronRight} className="text-muted-foreground" size={16} />
        </Pressable>
      </View>
      {top.length !== 0 ? (
        <View className="flex flex-col gap-3">
          {top.map((entry) => (
            <UserItem className="flex-1" key={entry.id} user={entry}>
              <Text className="font-bold">#{entry.rank}</Text>
            </UserItem>
          ))}
          {currentUser && (
            <>
              <View className="flex flex-row items-center justify-center py-1">
                <Icon as={MoreHorizontal} className="text-muted-foreground" size={18} />
              </View>
              <UserItem className="flex-1" key={currentUser.id} user={currentUser}>
                <Text className="font-bold">#{currentUser.rank}</Text>
              </UserItem>
            </>
          )}
        </View>
      ) : (
        <Text className="text-center text-sm font-medium text-muted-foreground">
          No court leaderboard data.
        </Text>
      )}
    </View>
  );
}
