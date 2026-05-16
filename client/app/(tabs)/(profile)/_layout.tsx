import BackButton from '@/components/BackButton';
import { Icon } from '@/components/ui/icon';
import { authClient } from '@/lib/auth-client';
import { Stack, useRouter } from 'expo-router';
import { PencilIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

export default function ProfileLayout() {
  const { data: currentUserData } = authClient.useSession();
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="user/[userId]"
        options={{
          headerTitle: 'Profile',
          headerLeft: () => <BackButton />,
          headerRight: () => (
            <Pressable
              className="active:opacity-70"
              onPress={() => router.push('/(tabs)/(profile)/edit')}>
              <Icon size={20} as={PencilIcon} />
            </Pressable>
          ),
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
        options={{ headerTitle: 'Change Email', headerLeft: () => <BackButton /> }}
      />
    </Stack>
  );
}
