import BackButton from '@/components/BackButton';
import { Stack } from 'expo-router';

export default function CourtsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Discover',
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
        }}
      />
      <Stack.Screen
        name="court/[courtId]/leaderboard"
        options={{
          headerTitle: 'Leaderboard',
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="add-court"
        options={{
          title: 'Add Court',
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
