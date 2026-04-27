import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
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
import { getColleges } from '@/lib/endpoints';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import { useMemo } from 'react';
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

  const collegeNameCounts = useMemo(() => {
    const counts = new Map<string, number>();
    colleges?.forEach((c) => counts.set(c.collegeName, (counts.get(c.collegeName) ?? 0) + 1));
    return counts;
  }, [colleges]);

  const { mutate: savePrimaryCollege, isPending: isSaving } = useMutation({
    mutationFn: async (primaryCourtId: number) =>
      await authClient.updateUser({
        primaryCourtId,
        onboardingStep: 'complete',
      }),
    onSuccess: () => {
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
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            const selected = colleges?.find((c) => c.courtId === value);
            return (
              <View className="flex w-full flex-col gap-2">
                <Select
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
                        const isAmbiguous = (collegeNameCounts.get(c.collegeName) ?? 0) > 1;
                        const label = isAmbiguous
                          ? `${c.collegeName} — ${c.courtName}`
                          : c.collegeName;
                        return (
                          <SelectItem
                            key={c.courtId}
                            label={label}
                            value={String(c.courtId)}
                            textStyle={{ color: c.collegeColor, fontWeight: '600' }}>
                            {label}
                          </SelectItem>
                        );
                      })}
                    </NativeSelectScrollView>
                  </SelectContent>
                </Select>
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
