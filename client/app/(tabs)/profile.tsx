import { NativewindScrollView } from '@/components/NativewindScrollView';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function Profile() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 items-center">
      <NativewindScrollView contentContainerClassName="flex w-full flex-col gap-6 px-4 py-6">
        <Button variant="destructive" size="lg" onPress={() => authClient.signOut()}>
          <Text>Sign OUt</Text>
        </Button>
      </NativewindScrollView>
    </KeyboardAvoidingView>
  );
}
