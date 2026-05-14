import { DeltaIndicator } from '@/components/design';
import { NativewindSectionList } from '@/components/NativewindSectionList';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import { getActivity, patchActivityRead } from '@/lib/endpoints';
import { Activity } from '@/types/activity';
import { useFocusEffect } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, formatDistanceToNow, isAfter, isToday, isYesterday, subDays } from 'date-fns';
import { useRouter } from 'expo-router';
import {
  BanIcon,
  ChevronRight,
  MoveRightIcon
} from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

type ActivitySection = {
  title: 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days';
  data: Activity[];
};

export default function ActivityPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: activityList, isPending: activityPending } = useQuery({
    queryKey: ['activity'],
    queryFn: getActivity,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: patchActivityRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['activity'] });
      const previousData = queryClient.getQueryData<Activity[]>(['activity']);
      queryClient.setQueryData<Activity[]>(['activity'], (old) =>
        old?.map((a) => ({ ...a, read: true }))
      );
      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['activity'], context.previousData);
      }
    },
  });

  useFocusEffect(
    useCallback(() => {
      const hasUnread = activityList?.some((a) => !a.read);
      if (hasUnread) {
        markAsRead();
      }
    }, [activityList, markAsRead])
  );

  const activitySections = useMemo(() => {
    if (!activityList) return [];

    const today: Activity[] = [];
    const yesterday: Activity[] = [];
    const last7Days: Activity[] = [];
    const last30Days: Activity[] = [];

    const now = new Date();
    const sevenDaysAgo = subDays(now, 7);
    const thirtyDaysAgo = subDays(now, 30);

    activityList.forEach((activity) => {
      const activityDate = new Date(activity.createdAt);

      if (isToday(activityDate)) {
        today.push(activity);
      } else if (isYesterday(activityDate)) {
        yesterday.push(activity);
      } else if (isAfter(activityDate, sevenDaysAgo)) {
        last7Days.push(activity);
      } else if (isAfter(activityDate, thirtyDaysAgo)) {
        last30Days.push(activity);
      }
    });

    const sections: ActivitySection[] = [];
    if (today.length > 0) sections.push({ title: 'Today', data: today });
    if (yesterday.length > 0) sections.push({ title: 'Yesterday', data: yesterday });
    if (last7Days.length > 0) sections.push({ title: 'Last 7 Days', data: last7Days });
    if (last30Days.length > 0) sections.push({ title: 'Last 30 Days', data: last30Days });

    return sections;
  }, [activityList]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <View className="flex w-full flex-1 flex-col">
        {activityPending ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : !activityList || activityList.length === 0 ? (
          <View className="px-4 py-6">
            <Empty className="border border-dashed border-border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Icon size={22} as={BanIcon} className="text-secondary-foreground" />
                </EmptyMedia>
                <EmptyTitle>No Activity</EmptyTitle>
                <EmptyDescription>
                  No activity yet. Get out there and hoop to start seeing some activity!
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onPress={() => router.navigate('/(tabs)/(home)')} size="sm">
                  <Text>Go Home</Text>
                </Button>
              </EmptyContent>
            </Empty>
          </View>
        ) : (
          <NativewindSectionList
            contentContainerClassName="pb-8 px-4"
            sections={activitySections}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({ section }) => (
              <Text className="py-3 text-lg font-bold">{section.title}</Text>
            )}
            renderItem={({ item }) => <ActivityCard activity={item} />}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View className="h-3" />}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function getRelativeTime(date: Date): string {
  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: false }) + ' ago';
  }
  return format(date, 'h:mm a');
}

function ActivityCard({ activity }: { activity: Activity }) {
  if (activity.type === 'archetype_change' && activity.rating) {
    return (
      <ActivityArchetypeCard
        to={activity.rating.rateeNewArchetype}
        from={activity.rating.rateeOldArchetype}
        when={getRelativeTime(new Date(activity.createdAt))}
      />
    );
  }

  if (activity.type === 'overall_change' && activity.rating) {
    return (
      <ActivityOVRCard
        from={activity.rating.rateeOldOverall}
        to={activity.rating.rateeNewOverall}
        when={getRelativeTime(new Date(activity.createdAt))}
      />
    );
  }

  if (activity.type === 'rank_change' && activity.rankChange) {
    return (
      <ActivityRankCard
        from={activity.rankChange.oldRank}
        to={activity.rankChange.newRank}
        when={getRelativeTime(new Date(activity.createdAt))}
      />
    );
  }

  return null;
}

function ActivityArchetypeCard({ to, from, when }: { to: string; from: string; when: string }) {
  const displayTo = to.toUpperCase();
  const displayFrom = from.toUpperCase();

  return (
    <View className="relative overflow-hidden rounded-2xl bg-foreground p-5">
      <View className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[40px] border-background/5" />
      <View className="flex flex-col gap-2">
        <Text className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-background/55">
          Archetype Changed · {when}
        </Text>
        <Text className="font-bebas text-4xl leading-[44px] tracking-tight text-primary-foreground">
          {to}
        </Text>

        <View className="flex-row items-center gap-1.5 flex-wrap">
          <View className="rounded-full border border-background/25 px-3 py-1">
            <Text className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-background/55">
              {displayFrom}
            </Text>
          </View>
          <Icon as={MoveRightIcon} size={16} className='text-muted-foreground'/>
          <View className="rounded-full bg-background px-3 py-1">
            <Text className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-foreground">
              {displayTo}
            </Text>
          </View>
        </View>

        {/* <View className="mt-4 flex-row gap-2">
        <Pressable className="rounded-full bg-background px-4 py-2">
          <View className="flex-row items-center gap-2">
            <Icon size={14} as={ShareIcon} className="text-foreground" />
            <Text className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-foreground">
              Share
            </Text>
          </View>
        </Pressable>
        <Pressable className="rounded-full border border-background/25 px-4 py-2">
          <Text className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-background/70">
            View Profile
          </Text>
        </Pressable>
      </View> */}
      </View>
    </View>
  );
}

function ActivityOVRCard({ from, to, when }: { from: number; to: number; when: string }) {
  const delta = to - from;
  const isPositive = delta > 0;

  const router = useRouter();
  const { data: currentUserdata } = authClient.useSession();

  return (
    <View className="flex flex-col gap-2.5 overflow-hidden rounded-2xl border border-border bg-card p-5">
      <View className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full border-[40px] border-muted/50" />
      <Text className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
        Overall {isPositive ? 'Up' : 'Down'} · {when}
      </Text>
      <View className="flex flex-col gap-1.5">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <Text className="font-bebas text-5xl leading-[52px] tracking-tighter">
              {to}
            </Text>
            <DeltaIndicator value={delta} size="sm" />
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text className="font-bebas text-2xl leading-[26px] line-through">
              {from}
            </Text>
            <Icon as={MoveRightIcon} />
            <Text className="font-bebas text-3xl leading-[33px]">
              {to}
            </Text>
          </View>
        </View>
        <View className="-mt-2 flex flex-row items-center justify-between">
          <Text className="text-xs font-semibold text-muted-foreground">New OVR</Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(tabs)/(profile)/user/[userId]',
                params: { userId: currentUserdata?.user.id! },
              })
            }
            className="flex flex-row items-center gap-0.5 self-end">
            <Text className="text-xs font-medium text-muted-foreground">View Profile</Text>
            <Icon as={ChevronRight} className="text-muted-foreground" size={16} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function ActivityRankCard({
  from,
  to,
  when,
}: {
  from: number;
  to: number;
  when: string;
  scope?: string;
}) {
  const delta = from - to;
  const isPositive = delta > 0;

  const router = useRouter();

  return (
    <View className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5">
      <View className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full border-[40px] border-muted/50" />
      <Text className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
        Rank {isPositive ? 'Up' : 'Down'} · {when}
      </Text>
      <View className="flex flex-col gap-1.5">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <Text className="font-bebas text-5xl leading-[52px] tracking-tighter">
              #{to}
            </Text>
            {to && from && <DeltaIndicator value={delta} size="sm" />}
          </View>
          {to && from && (
            <View className="flex flex-row items-center gap-2">
              <Text className="font-bebas text-2xl leading-[26px] line-through">
                #{from}
              </Text>
              <Icon as={MoveRightIcon} />
              <Text className="font-bebas text-3xl leading-[33px]">
                #{to}
              </Text>
            </View>
          )}
        </View>
        <View className="-mt-2 flex flex-row items-center justify-between">
          <Text className="text-xs font-semibold text-muted-foreground">New Rank</Text>
          <Pressable
            onPress={() => router.push('/(tabs)/(leaderboard)')}
            className="flex flex-row items-center gap-0.5 self-end">
            <Text className="text-xs font-medium text-muted-foreground">View Leaderboard</Text>
            <Icon as={ChevronRight} className="text-muted-foreground" size={16} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
