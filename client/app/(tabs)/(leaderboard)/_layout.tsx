import BackButton from '@/components/BackButton';
import { authClient } from '@/lib/auth-client';
import { Stack } from 'expo-router';

export default function LeaderboardLayout() {
  const { data: currentUserData } = authClient.useSession();

  return (
    <Stack>
      <Stack.Screen
        name="college/[collegeId]"
        options={{
          headerTitle: 'Leaderboard',
          headerLeft: () => <BackButton />,
        }}
        initialParams={{
          collegeId: currentUserData?.user.primaryCollegeId,
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
