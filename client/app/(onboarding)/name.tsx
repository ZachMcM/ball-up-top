import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import { patchUserName } from '@/lib/endpoints';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';
import { toast } from 'sonner-native';
import * as z from 'zod';

const NameSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export default function NamePage() {
  const { data: currentUserData, refetch: refetchAuthClientSession } = authClient.useSession();

  const { control, handleSubmit } = useForm<z.infer<typeof NameSchema>>({
    resolver: zodResolver(NameSchema),
    defaultValues: {
      firstName: !currentUserData?.user.name ? undefined : currentUserData?.user.name.split(' ')[0],
      lastName: !currentUserData?.user.name ? undefined : currentUserData?.user.name.split(' ')[1],
    },
  });

  const router = useRouter();

  const { mutate: saveName, isPending } = useMutation({
    mutationFn: async (name: string) => {
      await patchUserName(name);
    },
    onSuccess: () => {
      refetchAuthClientSession();
      toast.success('Name saved!', { position: 'bottom-center' });
      router.push('/height');
    },
    onError: (error) => {
      console.log('Error', error);
      toast.error(error.message, { position: 'bottom-center' });
    },
  });

  const onSubmit = (values: z.infer<typeof NameSchema>) =>
    saveName(`${values.firstName} ${values.lastName}`);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <View className="flex w-full flex-col items-center gap-4 p-8">
        <Text className="text-xl font-bold">What's your name?</Text>
        <View className="flex flex-row items-center gap-2">
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <View className="flex w-full flex-1 flex-col gap-2">
                <Input
                  autoFocus
                  placeholder="First Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  className={cn(error && 'border-destructive', 'w-full')}
                  value={value}
                />
                {error && (
                  <Text className="text-sm font-medium text-destructive">{error.message}</Text>
                )}
              </View>
            )}
            name="firstName"
          />
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <View className="flex w-full flex-1 flex-col gap-2">
                <Input
                  placeholder="Last Name"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  className={cn(error && 'border-destructive', 'w-full')}
                  value={value}
                />
                {error && (
                  <Text className="text-sm font-medium text-destructive">{error.message}</Text>
                )}
              </View>
            )}
            name="lastName"
          />
        </View>
        <Text className="text-xs font-medium text-muted-foreground">
          This will help others identify you. You can change this later.
        </Text>
        <Button className="w-full" size="lg" disabled={isPending} onPress={handleSubmit(onSubmit)}>
          <Text>Continue</Text>
          {isPending && <ActivityIndicator />}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
