import { CollegeCombobox } from '@/components/design/CollegeCombobox';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import { getColleges, patchUserPrimaryCollege } from '@/lib/endpoints';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';
import { toast } from 'sonner-native';
import * as z from 'zod';

const PrimaryCollegeSchema = z.object({
  primaryCollegeId: z
    .number({ message: 'Please select your primary college' })
    .int()
    .positive('Please select your primary college'),
});

export default function PrimaryCollegePage() {
  const { data: currentUserData } = authClient.useSession();
  const { data: colleges, isPending: collegesPending } = useQuery({
    queryKey: ['colleges'],
    queryFn: getColleges,
  });

  const { control, handleSubmit } = useForm<z.infer<typeof PrimaryCollegeSchema>>({
    resolver: zodResolver(PrimaryCollegeSchema),
    defaultValues: {
      primaryCollegeId: (currentUserData?.user as any)?.primaryCollegeId ?? undefined,
    },
  });

  const router = useRouter();
  const { refetch: refetchAuthClientSession } = authClient.useSession();
  const queryClient = useQueryClient();

  const { mutate: savePrimaryCollege, isPending: isSaving } = useMutation({
    mutationFn: async (primaryCollegeId: number) => {
      await patchUserPrimaryCollege(primaryCollegeId);
      return primaryCollegeId;
    },
    onSuccess: (primaryCollegeId) => {
      refetchAuthClientSession();
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard', primaryCollegeId] });
      toast.success('Primary college saved!', { position: 'bottom-center' });
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
        <Text className="text-xl font-bold">Pick your primary college.</Text>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View className="flex w-full flex-col gap-3">
              <CollegeCombobox
                colleges={colleges}
                isPending={collegesPending}
                selectedCollegeId={value}
                onSelect={onChange}
              />
              {error && (
                <Text className="text-sm font-medium text-destructive">{error.message}</Text>
              )}
            </View>
          )}
          name="primaryCollegeId"
        />
        <Text className="text-center text-xs font-medium text-muted-foreground">
          Your primary college will appear on your home page. You can change this later.
        </Text>
        <View className="flex w-full flex-row items-center gap-2">
          {router.canGoBack() && (
            <Button size="lg" className="flex-1" onPress={() => router.back()} variant="outline">
              <Icon as={ArrowLeftIcon} size={18} />
              <Text>Back</Text>
            </Button>
          )}
          <Button
            disabled={isSaving}
            size="lg"
            className="flex-1"
            onPress={handleSubmit((values) => savePrimaryCollege(values.primaryCollegeId))}>
            <Text>Continue</Text>
            {isSaving && <ActivityIndicator size="small" className="text-primary-foreground" />}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
