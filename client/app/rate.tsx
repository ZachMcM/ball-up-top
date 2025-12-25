import { NativewindScrollView } from '@/components/NativewindScrollView';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function RatePage() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <NativewindScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="flex w-full flex-col gap-4"
        keyboardShouldPersistTaps="handled"></NativewindScrollView>
    </KeyboardAvoidingView>
  );
}
