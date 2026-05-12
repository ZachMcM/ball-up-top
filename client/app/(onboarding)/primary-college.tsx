import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
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
import { getColleges, patchUserPrimaryCollege } from '@/lib/endpoints';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';
import { toast } from 'sonner-native';
import * as z from 'zod';

const PrimaryCollegeSchema = z.object({
  primaryCourtId: z
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
      primaryCourtId: currentUserData?.user.primaryCourtId ?? undefined,
    },
  });

  const router = useRouter();

  const { refetch: refetchAuthClientSession } = authClient.useSession();
  const queryClient = useQueryClient();

  const { mutate: savePrimaryCollege, isPending: isSaving } = useMutation({
    mutationFn: async (primaryCourtId: number) => {
      await patchUserPrimaryCollege(primaryCourtId);
      return primaryCourtId;
    },

    onSuccess: (primaryCourtId) => {
      refetchAuthClientSession();
      queryClient.invalidateQueries({
        queryKey: ['home'],
      });
      queryClient.invalidateQueries({
        queryKey: ['leaderboard', primaryCourtId],
      });
      toast.success('Primary college saved!', { position: 'bottom-center' });
    },
    onError: (error) => {
      console.log('Error', error);
      toast.error(error.message, { position: 'bottom-center' });
    },
  });

  const [searchInput, setSearchInput] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <View className="flex w-full flex-col items-center gap-4 p-8">
        <Text className="text-xl font-bold">Pick your primary college.</Text>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => {
            return (
              <View className="flex w-full flex-col gap-2">
                <Input
                  placeholder="Search for your college..."
                  value={searchInput}
                  onChangeText={setSearchInput}
                  // TODO
                  editable={!collegesPending || !colleges}
                />
                {colleges?.map((college) => (
                  <View></View>
                ))}
                {/* <Select
                  value={
                    selected
                      ? { value: String(selected.courtId), label: selected.collegeName }
                      : undefined
                  }
                  onValueChange={(option) => onChange(option ? Number(option.value) : undefined)}>
                  <SelectTrigger className="w-full rounded-2xl">
                    <SelectValue placeholder="Select your primary college" />
                  </SelectTrigger>
                  <SelectContent>
                    <NativeSelectScrollView>
                      {collegesPending && (
                        <View className="items-center py-4">
                          <ActivityIndicator />
                        </View>
                      )}
                      {colleges?.map((c) => {
                        return (
                          <SelectItem
                            key={c.courtId}
                            label={c.collegeName}
                            value={String(c.courtId)}
                            textStyle={{ color: c.collegeColor, fontWeight: '600' }}>
                            {c.collegeName}
                          </SelectItem>
                        );
                      })}
                    </NativeSelectScrollView>
                  </SelectContent>
                </Select> */}
                {error && (
                  <Text className="text-sm font-medium text-destructive">{error.message}</Text>
                )}
              </View>
            );
          }}
          name="primaryCourtId"
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
            onPress={handleSubmit((values) => savePrimaryCollege(values.primaryCourtId))}>
            <Text>Continue</Text>
            {isSaving && <ActivityIndicator />}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
