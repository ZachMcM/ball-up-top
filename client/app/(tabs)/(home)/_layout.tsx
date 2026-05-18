import BackButton from '@/components/BackButton';
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Home',
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
        name="college/[collegeId]"
        options={{
          headerTitle: 'Leaderboard',
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="court/[courtId]/active-players"
        options={{
          presentation: 'modal',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
