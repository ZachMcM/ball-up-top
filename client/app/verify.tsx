import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useCountdown } from '@/hooks/useCountdown';
import { authClient } from '@/lib/auth-client';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, TextStyle, View } from 'react-native';
import { toast } from 'sonner-native';

const RESEND_CODE_INTERVAL_SECONDS = 30;

const TABULAR_NUMBERS_STYLE: TextStyle = { fontVariant: ['tabular-nums'] };

export default function Verify() {
  const { email }: { email: string } = useLocalSearchParams();
  const { countdown, restartCountdown } = useCountdown(RESEND_CODE_INTERVAL_SECONDS);

  if (!email) {
    return <Redirect href="/" />;
  }

  async function getNewOtp() {
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: 'sign-in',
    });
    console.log('Response:', data, error);
  }

  const [otp, setOtp] = useState('');

  const [isPending, setIsPending] = useState(false);

  async function signIn() {
    setIsPending(true);
    const { data, error } = await authClient.signIn.emailOtp({
      email,
      otp,
    });
    setIsPending(false);
    if (error && error.message) {
      toast.error(error.message);
    }
    console.log('Response', data, error);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 items-center">
      <View className="flex w-full flex-col items-center gap-4 p-8">
        <Text className="text-xl font-bold">Verify your email</Text>
        <Input
          value={otp}
          onChangeText={setOtp}
          id="code"
          placeholder="123456"
          autoCapitalize="none"
          returnKeyType="send"
          keyboardType="numeric"
          autoComplete="sms-otp"
          textContentType="oneTimeCode"
          onSubmitEditing={signIn}
        />
        <Button
          variant="link"
          size="sm"
          disabled={countdown > 0}
          onPress={() => {
            getNewOtp();
            restartCountdown();
          }}>
          <Text className="text-center text-xs">
            Didn&apos;t receive the code? Resend{' '}
            {countdown > 0 ? (
              <Text className="text-xs" style={TABULAR_NUMBERS_STYLE}>
                ({countdown})
              </Text>
            ) : null}
          </Text>
        </Button>
        <Button className="w-full" disabled={isPending} onPress={signIn} size="lg">
          {isPending && <ActivityIndicator />}
          <Text>Continue</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
