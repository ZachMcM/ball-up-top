import { NativewindScrollView } from '@/components/NativewindScrollView';
import { authClient } from '@/lib/auth-client';
import { getUser } from '@/lib/endpoints';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';

export default function ProfilePage() {
  const searchParams = useLocalSearchParams();
  const { userId } = searchParams as { userId: string };

  const { data: user, isPending } = useQuery({
    queryFn: async () => getUser(userId),
    queryKey: ['user', userId],
  });

  const { data: currentUserData } = authClient.useSession();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: user?.name ?? 'Profile',
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        {isPending ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : (
          user && (
            <NativewindScrollView
              contentInsetAdjustmentBehavior="automatic"
              contentContainerClassName="flex w-full flex-col gap-6 px-4 py-6"
              keyboardShouldPersistTaps="handled"></NativewindScrollView>
          )
        )}
      </KeyboardAvoidingView>
    </>
  );
}
