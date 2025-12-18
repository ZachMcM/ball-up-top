import { NativewindScrollView } from '@/components/NativewindScrollView';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import { Stack } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function ProfilePage() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <NativewindScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="flex w-full flex-col gap-6 px-4 py-6"
        keyboardShouldPersistTaps="handled">
        <Button variant="destructive" size="lg" onPress={() => authClient.signOut()}>
          <Text>Sign Out</Text>
        </Button>
      </NativewindScrollView>
    </KeyboardAvoidingView>
  );
}
