import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="user/[userId]"
        options={{
          headerTitle: 'Profile',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen
        name="court/[courtId]/index"
        options={{
          headerTitle: 'Court',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen
        name="court/[courtId]/players"
        options={{
          headerTitle: 'Current Players',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
    </Stack>
  );
}
