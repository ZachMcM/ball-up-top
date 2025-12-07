import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { toast } from 'sonner-native';
import * as z from 'zod';

const EmailSchema = z.object({
  email: z.email(),
});

export default function Index() {
  const { control, handleSubmit } = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
  });

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof EmailSchema>) => {
    sendOTP(values.email);
    router.navigate(`/verify-otp?email=${encodeURIComponent(values.email)}`);
  };

  async function sendOTP(email: string) {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: 'sign-in',
    });
    if (error) {
      console.log('Error:', error);
      toast.error(error.message ?? 'Error sending OTP');
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 items-center">
      <View className="flex w-full flex-col items-center gap-4 p-8">
        <Text className="text-xl font-bold">What's your email?</Text>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <View className="flex w-full flex-col gap-2">
              <Input
                autoFocus
                placeholder="johndoe@example.com"
                onBlur={onBlur}
                onChangeText={onChange}
                className={cn(error && 'border-destructive', 'w-full')}
                value={value}
                onSubmitEditing={handleSubmit(onSubmit)}
                keyboardType="email-address"
              />
              {error && (
                <Text className="text-sm font-medium text-destructive">{error.message}</Text>
              )}
            </View>
          )}
          name="email"
        />
        <Text className="text-center text-xs font-medium text-muted-foreground">
          By continuing, you agree to our Privacy Policy and Terms of Service
        </Text>
        <Button className="w-full" size="lg" onPress={handleSubmit(onSubmit)}>
          <Text>Continue</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
