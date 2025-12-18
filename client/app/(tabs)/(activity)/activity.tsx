import { NativewindScrollView } from '@/components/NativewindScrollView';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function ActivityPage() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <NativewindScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="flex w-full flex-col gap-6 px-4 py-6"
        keyboardShouldPersistTaps="handled"></NativewindScrollView>
    </KeyboardAvoidingView>
  );
}
