import { Stack, useRouter } from 'expo-router';

export default function ActivityLayout() {
  const router = useRouter()

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
          headerTransparent: false,
          headerSearchBarOptions: {
            onChangeText: (event) => {
              router.setParams({
                searchQuery: event.nativeEvent.text,
              });
            },
          },
        }}
      />
    </Stack>
  );
}
