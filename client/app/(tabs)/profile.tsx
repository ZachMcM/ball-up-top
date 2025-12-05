import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function Profile() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 items-center">
      <ScrollView></ScrollView>
    </KeyboardAvoidingView>
  );
}
