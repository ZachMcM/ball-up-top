import { NativewindScrollView } from '@/components/NativewindScrollView';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function Activity() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 items-center">
      <NativewindScrollView
        contentContainerClassName="flex w-full flex-col gap-6 px-4 py-6"
        keyboardShouldPersistTaps="handled"></NativewindScrollView>
    </KeyboardAvoidingView>
  );
}
