import { Stack } from 'expo-router';

export default function ActivityLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="activity"
        options={{
          title: 'Activity',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
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
