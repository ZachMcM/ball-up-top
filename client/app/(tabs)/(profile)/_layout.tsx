import BackButton from '@/components/BackButton';
import { authClient } from '@/lib/auth-client';
import { Stack, useRouter } from 'expo-router';

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
        name="edit"
        options={{ headerTitle: 'Edit Profile', headerLeft: () => <BackButton /> }}
      />
      <Stack.Screen
        name="edit-email"
        options={{ headerTitle: 'Change Email', presentation: 'modal' }}
      />
    </Stack>
  );
}
