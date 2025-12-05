import { Button } from '@/components/ui/button';
import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';
import { toast } from 'sonner-native';
import * as z from 'zod';

const generateHeightOptions = () => {
  const options: { label: string; value: string }[] = [];
  for (let feet = 4; feet <= 8; feet++) {
    const maxInches = feet === 8 ? 0 : 11;
    for (let inches = 0; inches <= maxInches; inches++) {
      const label = `${feet}'${inches}"`;
      options.push({ label, value: label });
    }
  }
  return options;
};

const HEIGHT_OPTIONS = generateHeightOptions();

const HeightSchema = z.object({
  height: z.string().min(1, 'Please select your height'),
});

export default function Height() {
  const { data: currentUserData } = authClient.useSession();

  const form = useForm<z.infer<typeof HeightSchema>>({
    resolver: zodResolver(HeightSchema),
    defaultValues: {
      height: !currentUserData?.user.height ? undefined : currentUserData.user.height,
    },
  });

  const router = useRouter();

  const { mutate: saveHeight, isPending } = useMutation({
    mutationFn: async (height: string) =>
      await authClient.updateUser({
        height,
        onboardingStep: 'image',
      }),
    onSuccess: () => {
      toast.success('Height saved!', { position: 'bottom-center' });
      router.push('/image');
    },
    onError: (error) => {
      console.log('Error', error);
      (toast.error(error.message), { position: 'bottom-center' });
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <View className="flex w-full flex-col items-center gap-4 p-8">
        <Text className="text-xl font-bold">What's your height?</Text>
        <Controller
          control={form.control}
          rules={{ required: true }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View className="flex w-full flex-col gap-2">
              <Select
                value={{ value, label: value }}
                onValueChange={(option) => onChange(option?.value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your height" />
                </SelectTrigger>
                <SelectContent>
                  <NativeSelectScrollView>
                    {HEIGHT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} label={option.label} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </NativeSelectScrollView>
                </SelectContent>
              </Select>
              {error && (
                <Text className="text-sm font-medium text-destructive">{error.message}</Text>
              )}
            </View>
          )}
          name="height"
        />
        <Text className="text-center text-xs font-medium text-muted-foreground">
          This will help determine your archetype and help others identify you. You can change this
          later.
        </Text>
        <Button
          disabled={isPending}
          className="w-full"
          size="lg"
          onPress={form.handleSubmit((values) => saveHeight(values.height))}>
          <Text>Continue</Text>
          {isPending && <ActivityIndicator />}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
