import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import { patchUserHeight } from '@/lib/endpoints';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';
import { toast } from 'sonner-native';
import * as z from 'zod';

const parseHeight = (height: string | undefined): { feet: string; inches: string } => {
  if (!height) return { feet: '', inches: '' };
  const match = height.match(/^(\d+)'(\d+)"$/);
  if (match) {
    return { feet: match[1], inches: match[2] };
  }
  return { feet: '', inches: '' };
};

const HeightSchema = z.object({
  feet: z
    .string()
    .min(1, 'Required')
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 4 && num <= 8;
    }, 'Must be 4-8'),
  inches: z
    .string()
    .min(1, 'Required')
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 0 && num <= 11;
    }, 'Must be 0-11'),
});

export default function HeightPage() {
  const { data: currentUserData, refetch: refetchAuthClientSession } = authClient.useSession();
  const parsed = parseHeight(currentUserData?.user.height);

  const { control, handleSubmit } = useForm<z.infer<typeof HeightSchema>>({
    resolver: zodResolver(HeightSchema),
    defaultValues: {
      feet: parsed.feet,
      inches: parsed.inches,
    },
  });

  const router = useRouter();

  const { mutate: saveHeight, isPending } = useMutation({
    mutationFn: async ({ feet, inches }: { feet: string; inches: string }) => {
      const height = `${feet}'${inches}"`;
      await patchUserHeight(height);
    },
    onSuccess: () => {
      refetchAuthClientSession();
      toast.success('Height saved!', { position: 'bottom-center' });
      router.push('/image');
    },
    onError: (error) => {
      console.log('Error', error);
      toast.error(error.message, { position: 'bottom-center' });
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <View className="flex w-full flex-col items-center gap-4 p-8">
        <Text className="text-xl font-bold">What's your height?</Text>
        <View className="flex w-full flex-row items-start gap-3">
          <Controller
            control={control}
            name="feet"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <View className="flex flex-1 flex-col gap-1">
                <Text className="text-sm font-medium text-muted-foreground">Feet</Text>
                <Input
                  placeholder="6"
                  value={value}
                  onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  maxLength={1}
                />
                {error && (
                  <Text className="text-xs font-medium text-destructive">{error.message}</Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="inches"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <View className="flex flex-1 flex-col gap-1">
                <Text className="text-sm font-medium text-muted-foreground">Inches</Text>
                <Input
                  placeholder="2"
                  value={value}
                  onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                {error && (
                  <Text className="text-xs font-medium text-destructive">{error.message}</Text>
                )}
              </View>
            )}
          />
        </View>
        <Text className="text-center text-xs font-medium text-muted-foreground">
          This will help determine your archetype and help others identify you. You can change this
          later.
        </Text>
        <View className="flex w-full flex-row items-center gap-2">
          {router.canGoBack() && (
            <Button size="lg" className="flex-1" onPress={() => router.back()} variant="outline">
              <Icon as={ArrowLeftIcon} size={18} />
              <Text>Back</Text>
            </Button>
          )}
          <Button
            disabled={isPending}
            size="lg"
            className="flex-1"
            onPress={handleSubmit((values) => saveHeight(values))}>
            <Text>Continue</Text>
            {isPending && <ActivityIndicator />}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
