import BackButton from '@/components/BackButton';
import { authClient } from '@/lib/auth-client';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  const { data: currentUserData } = authClient.useSession();

  return (
    <Stack>
      <Stack.Screen
        name="user/[userId]"
        options={{
          headerTitle: 'Profile',
          headerLeft: () => <BackButton />,
        }}
        initialParams={{
          userId: currentUserData?.user.id,
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
