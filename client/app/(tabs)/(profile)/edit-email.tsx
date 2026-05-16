import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useCountdown } from '@/hooks/useCountdown';
import { authClient } from '@/lib/auth-client';
import { patchUserEmail } from '@/lib/endpoints';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import { Fragment, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';
import { toast } from 'sonner-native';
import * as z from 'zod';

const EmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function EditEmailPage() {
  const { data: session, refetch: refetchAuthClientSession } = authClient.useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [step, setStep] = useState<0 | 1>(0);
  const [otp, setOtp] = useState('');
  const [isPending, setIsPending] = useState(false);
  const { countdown, restartCountdown } = useCountdown(30);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
  });

  const { email } = watch();

  async function sendOTP(emailAddr: string) {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: emailAddr,
      type: 'email-verification',
    });
    if (error) {
      toast.error(error.message ?? 'Error sending code', { position: 'bottom-center' });
      return false;
    }
    return true;
  }

  const onSubmitEmail = async ({ email: newEmail }: z.infer<typeof EmailSchema>) => {
    if (newEmail === session?.user.email) {
      toast.error('New email must be different from your current email', {
        position: 'bottom-center',
      });
      return;
    }
    setIsPending(true);
    const ok = await sendOTP(newEmail);
    setIsPending(false);
    if (ok) {
      restartCountdown();
      setStep(1);
    }
  };

  const onSubmitOtp = async () => {
    if (!otp || otp.length < 6) return;
    setIsPending(true);
    try {
      await patchUserEmail(email, otp);
      await refetchAuthClientSession();
      queryClient.invalidateQueries({ queryKey: ['user', session?.user.id] });
      toast.success('Email updated!', { position: 'bottom-center' });
      router.back();
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to update email', { position: 'bottom-center' });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 items-center">
      <View className="flex w-full flex-col items-center gap-4 p-8">
        {step === 0 ? (
          <Fragment>
            <Text className="text-xl font-bold">Enter your new email</Text>
            <Text className="text-center text-sm text-muted-foreground">
              Current: {session?.user.email}
            </Text>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View className="flex w-full flex-col gap-2">
                  <Input
                    autoFocus
                    placeholder="new@example.com"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className={cn(error && 'border-destructive', 'rounded-full')}
                    textContentType="emailAddress"
                    autoComplete="email"
                    keyboardType="email-address"
                    onSubmitEditing={handleSubmit(onSubmitEmail)}
                  />
                  {error && (
                    <Text className="text-sm font-medium text-destructive">{error.message}</Text>
                  )}
                </View>
              )}
              name="email"
            />
            <Button
              className="w-full"
              size="lg"
              disabled={isPending}
              onPress={handleSubmit(onSubmitEmail)}>
              <Text>Send Code</Text>
              {isPending && (
                <ActivityIndicator size="small" className="text-primary-foreground" />
              )}
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Text className="text-xl font-bold">Verify your new email</Text>
            <Text className="text-center text-sm text-muted-foreground">
              We sent a code to {email}
            </Text>
            <Input
              value={otp}
              onChangeText={setOtp}
              autoFocus
              placeholder="123456"
              autoCapitalize="none"
              returnKeyType="send"
              keyboardType="number-pad"
              autoComplete="sms-otp"
              textContentType="oneTimeCode"
              onSubmitEditing={onSubmitOtp}
              className="rounded-full"
            />
            <Button
              variant="link"
              size="sm"
              disabled={countdown > 0}
              onPress={async () => {
                await sendOTP(email);
                restartCountdown();
              }}>
              <Text className="text-center text-xs">
                Didn't receive the code? Resend{' '}
                {countdown > 0 ? <Text className="text-xs">({countdown})</Text> : null}
              </Text>
            </Button>
            <View className="flex w-full flex-row items-center gap-2">
              <Button
                variant="outline"
                onPress={() => {
                  setStep(0);
                  setOtp('');
                }}
                size="lg"
                className="flex-1">
                <Icon as={ArrowLeftIcon} size={18} />
                <Text>Back</Text>
              </Button>
              <Button
                className="flex-1"
                disabled={isPending || otp.length < 6}
                onPress={onSubmitOtp}
                size="lg">
                <Text>Confirm</Text>
                {isPending && (
                  <ActivityIndicator size="small" className="text-primary-foreground" />
                )}
              </Button>
            </View>
          </Fragment>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
