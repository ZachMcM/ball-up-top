import BackButton from '@/components/BackButton';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
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
    </Stack>
  );
}
