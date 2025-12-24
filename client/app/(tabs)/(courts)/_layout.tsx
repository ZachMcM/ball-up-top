import { Stack } from 'expo-router';

export default function CourtsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Pull Up',
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
      <Stack.Screen
        name="add-court"
        options={{
          title: 'Add Court',
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
    </Stack>
  );
}
