import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { getUser, patchUserAnonymousRater } from '@/lib/endpoints';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import {
  BellIcon,
  BellOffIcon,
  BinaryIcon,
  EyeIcon,
  EyeOffIcon,
  FootprintsIcon,
  ZapIcon,
} from 'lucide-react-native';
import { type ComponentType } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { toast } from 'sonner-native';

function BulletRow({ icon, text }: { icon: typeof BinaryIcon; text: string }) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="mt-0.5 h-5 w-5 items-center justify-center">
        <Icon as={icon} size={15} className="text-muted-foreground" />
      </View>
      <Text className="flex-1 text-sm leading-[22px] text-muted-foreground">{text}</Text>
    </View>
  );
}

export default function AnonymityPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: sessionData } = authClient.useSession();
  const userId = sessionData?.user.id;

  const { data: user, isPending: userPending } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => getUser(userId!),
    enabled: !!userId,
  });

  const { mutate: toggleAnonymity, isPending } = useMutation({
    mutationFn: () => patchUserAnonymousRater(!user!.anonymousRater),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      toast.success(
        user?.anonymousRater
          ? 'Anonymity off. Players can now see when you rate them.'
          : "You're anonymous. Players won't know when you rate them."
      );
      router.back();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Something went wrong', { position: 'bottom-center' });
    },
  });

  if (userPending || !user) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  const turningOff = user.anonymousRater;

  return (
    <View className="flex-1 px-6 pt-8">
      <View className="flex-1 gap-8">
        <View className="items-center gap-4">
          <View className="flex-row items-center gap-2 rounded-full bg-muted px-4 py-1.5">
            <Icon
              as={turningOff ? EyeOffIcon : EyeIcon}
              size={13}
              className="text-muted-foreground"
            />
            <Text className="text-xs font-semibold tracking-wide text-muted-foreground">
              {turningOff ? 'CURRENTLY ANONYMOUS' : 'CURRENTLY VISIBLE'}
            </Text>
          </View>
          <Icon as={FootprintsIcon} size={52} className="text-primary" />
        </View>

        <View className="gap-2">
          <Text className="text-center text-2xl font-bold tracking-tight">
            {turningOff ? 'Come back out?' : 'Disappear from the feed?'}
          </Text>
          <Text className="text-center text-sm leading-[22px] text-muted-foreground">
            {turningOff
              ? "Once you're back out, you stay visible for 30 days. No flipping back."
              : "Once you go dark, you're locked out of switching for 30 days."}
          </Text>
        </View>

        <View className="gap-4">
          <BulletRow
            icon={ZapIcon}
            text="Your ratings hit the same either way — only who gets the credit changes"
          />
          <BulletRow
            icon={turningOff ? EyeIcon : EyeOffIcon}
            text={
              turningOff
                ? 'Players you rate will see your name and photo in their feed'
                : "Players you rate won't see your name or photo in their feed"
            }
          />
          <BulletRow
            icon={turningOff ? BellIcon : BellOffIcon}
            text={
              turningOff
                ? "You'll show up in their rating notifications again"
                : "You're cut from their rating notifications too"
            }
          />
        </View>
      </View>

      <View className="gap-3 pb-10 pt-6">
        <Button
          size="lg"
          onPress={() => toggleAnonymity()}
          disabled={isPending}
          className="rounded-full">
          {isPending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-base font-semibold text-primary-foreground">
              {turningOff ? 'Reveal Yourself' : 'Go Anonymous'}
            </Text>
          )}
        </Button>
        <Button variant="ghost" onPress={() => router.back()} disabled={isPending}>
          <Text className="text-sm text-muted-foreground">
            {turningOff ? 'Stay anonymous' : 'Stay visible'}
          </Text>
        </Button>
      </View>
    </View>
  );
}
