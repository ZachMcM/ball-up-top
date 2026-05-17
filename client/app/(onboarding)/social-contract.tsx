import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import { patchUserAcceptSocialContract } from '@/lib/endpoints';
import { useMutation } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function SocialContractPage() {
  const { refetch: refetchAuthClientSession } = authClient.useSession();

  const { mutate: acceptContract, isPending } = useMutation({
    mutationFn: patchUserAcceptSocialContract,
    onSuccess: () => {
      refetchAuthClientSession();
    },
    onError: (error) => {
      toast.error(error.message, { position: 'bottom-center' });
    },
  });

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow px-7 pb-8"
          showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center">
            <View className="mb-6">
              <Text className="text-[44px] font-extrabold italic leading-[48px] tracking-tight">
                Your rep already exists.
              </Text>
              <Text className="text-[44px] font-extrabold italic leading-[48px] tracking-tight text-primary">
                We just made it visible.
              </Text>
            </View>

            <Text className="mb-10 text-[13px] leading-[20px] text-muted-foreground">
              Rate your opponents after every session. They rate you. Your OVR is what they actually think, not what you think.
            </Text>

            <View className="gap-4 border-t border-border pt-6">
              <RuleLine
                index="01"
                copy="After every run, rate who you played with. Honestly."
              />
              <RuleLine
                index="02"
                copy="Your OVR is what the court says about your game, not what you say."
              />
              <RuleLine
                index="03"
                copy="Skip it and the court moves on without you."
              />
            </View>
          </View>
          <Button
            size="lg"
            className="w-full"
            disabled={isPending}
            onPress={() => acceptContract()}>
            <Text>I understand, I'm in!</Text>
            {isPending && <ActivityIndicator size="small" className="text-primary-foreground" />}
          </Button>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function RuleLine({ index, copy }: { index: string; copy: string }) {
  return (
    <View className="flex-row items-baseline gap-3">
      <Text className="w-6 font-bebas text-base tracking-[2px] text-primary">{index}</Text>
      <Text className="flex-1 text-[13px] leading-[19px] text-muted-foreground">{copy}</Text>
    </View>
  );
}
