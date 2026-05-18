import BackButton from '@/components/BackButton';
import { Stack } from 'expo-router';

export default function ActivityLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Activity',
        }}
      />
      <Stack.Screen
        name="college/[collegeId]"
        options={{
          headerTitle: 'Leaderboard',
          headerLeft: () => <BackButton />,
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
