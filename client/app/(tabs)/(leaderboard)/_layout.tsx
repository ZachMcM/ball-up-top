import BackButton from '@/components/BackButton';
import { Stack } from 'expo-router';

export default function LeaderboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Leaderboard',
        }}
      />
      <Stack.Screen
        name="user/[userId]"
        options={{
          headerTitle: 'Profile',
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  );
}
