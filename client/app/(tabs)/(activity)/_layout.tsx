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
        name="user/[userId]"
        options={{
          headerTitle: 'Profile',
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="court/[courtId]/index"
        options={{
          headerTitle: 'Court',
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="court/[courtId]/players"
        options={{
          headerTitle: 'Current Players',
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name='court/[courtId]/leaderboard'
        options={{
          headerTitle: "Leaderboard",
          headerLeft: () => <BackButton/>
        }}
      />
    </Stack>
  );
}
