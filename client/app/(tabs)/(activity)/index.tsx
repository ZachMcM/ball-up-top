import { ArchetypePill } from '@/components/design/ArchetypePill';
import { DeltaIndicator } from '@/components/design/DeltaIndicator';
import { OVRDisplay } from '@/components/design/OVRDisplay';
import { SegmentedControl } from '@/components/design/SegmentedControl';
import { NativewindSectionList } from '@/components/NativewindSectionList';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { getActivity, patchActivityRead } from '@/lib/endpoints';
import { timeAgo } from '@/lib/utils';
import { Activity } from '@/types/activity';
import { useFocusEffect } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAfter, isToday, isYesterday, subDays } from 'date-fns';
import { useRouter } from 'expo-router';
import { BanIcon } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';

type ActivitySection = {
  title: 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days';
  data: Activity[];
};

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState<'My Activity' | 'Campus'>('My Activity');
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
        {/* Header */}
        <View className="border-b border-border px-4 py-4">
          <Text className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Your Feed
          </Text>
          <Text className="mt-1 text-2xl font-extrabold tracking-tight">Activity</Text>
        </View>

        {/* Segmented Control */}
        <View className="px-4 py-3">
          <SegmentedControl
            options={['My Activity', 'Campus']}
            selected={activeTab}
            onChange={(v) => setActiveTab(v as 'My Activity' | 'Campus')}
          />
        </View>

        {activeTab === 'My Activity' ? (
          activityPending ? (
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
                <View className="py-3">
                  <Text className="text-base font-bold">{section.title}</Text>
                </View>
              )}
              renderItem={({ item }) => <ActivityCard activity={item} />}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <View className="h-3" />}
            />
          )
        ) : (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-center text-muted-foreground">
              Campus activity coming soon
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  switch (activity.type) {
    case 'archetype_change':
      return <ArchetypeChangeCard activity={activity} />;
    case 'overall_change':
      return <OverallChangeCard activity={activity} />;
    case 'rank_change':
      return <RankChangeCard activity={activity} />;
    default:
      return null;
  }
}

function ArchetypeChangeCard({ activity }: { activity: Activity }) {
  const rating = activity.rating;
  if (!rating) return null;

  return (
    <Card className="overflow-hidden bg-foreground p-0">
      <View className="relative p-5">
        {/* Decorative circle */}
        <View
          className="absolute -right-10 -top-10 size-40 rounded-full border-[40px] border-black/5"
        />
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xs font-bold uppercase tracking-widest text-background/50">
            Archetype Unlocked · {timeAgo(activity.createdAt)}
          </Text>
          {!activity.read && (
            <Text className="text-xs font-bold text-background/50">NEW</Text>
          )}
        </View>
        <Text
          className="mt-3 text-4xl font-extrabold uppercase leading-tight tracking-tight text-background"
          style={{ fontFamily: 'BebasNeue_400Regular' }}>
          {(rating as any).rateeNewArchetype ?? 'New\nArchetype'}
        </Text>
        <Text className="mt-3 text-sm leading-snug text-background/70">
          You're now <Text className="font-bold text-background">{(rating as any).rateeNewArchetype}</Text>. Check your new identity on the leaderboard.
        </Text>
        <View className="mt-4 flex flex-row gap-2">
          <View className="rounded-full bg-background px-4 py-1.5">
            <Text className="text-xs font-extrabold uppercase tracking-widest text-foreground">
              Share
            </Text>
          </View>
          <View className="rounded-full border border-black/20 px-4 py-1.5">
            <Text className="text-xs font-extrabold uppercase tracking-widest text-background/70">
              View
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

function OverallChangeCard({ activity }: { activity: Activity }) {
  const rating = activity.rating;
  if (!rating) return null;

  const oldOvr = rating.rateeOldOverall;
  const newOvr = rating.rateeNewOverall;
  const delta = newOvr - oldOvr;

  return (
    <Card className="overflow-hidden p-0">
      <View className="px-4 py-3">
        <Text className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          OVR moved · {timeAgo(activity.createdAt)}
        </Text>
      </View>
      <View className="flex flex-row items-end gap-4 px-4 pb-4">
        <Text
          className={`text-6xl font-extrabold leading-none ${delta > 0 ? 'text-green-400' : 'text-red-400'}`}
          style={{ fontFamily: 'BebasNeue_400Regular' }}>
          {delta > 0 ? '↑' : '↓'}{Math.abs(delta)}
        </Text>
        <View className="mb-2 flex-1">
          <View className="flex flex-row items-center gap-2">
            <Text className="font-mono text-base text-muted-foreground line-through tabular-nums">
              {oldOvr}
            </Text>
            <Text className="text-muted-foreground">→</Text>
            <OVRDisplay value={newOvr} size="md" />
          </View>
          <Text className="mt-1 text-sm leading-snug text-muted-foreground">
            Your OVR moved to {newOvr} after your last session.
          </Text>
        </View>
      </View>
    </Card>
  );
}

function RankChangeCard({ activity }: { activity: Activity }) {
  const rankChange = activity.rankChange;
  if (!rankChange) return null;

  const { oldRank, newRank } = rankChange;
  const delta = oldRank - newRank; // Positive if rank improved (lower number = better)

  return (
    <Card className="p-4">
      <Text className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Rank Change · {timeAgo(activity.createdAt)}
      </Text>
      <View className="mt-2 flex flex-row items-end gap-4">
        <Text
          className="text-5xl font-extrabold leading-none"
          style={{ fontFamily: 'BebasNeue_400Regular' }}>
          #{newRank}
        </Text>
        <View className="mb-1.5">
          <Text className="text-sm text-muted-foreground">on campus</Text>
          <DeltaIndicator value={delta} type="rank" size="md" />
        </View>
      </View>
      {activity.court && (
        <View className="mt-3 flex flex-row items-center gap-3 rounded-xl border border-border p-3">
          <Avatar
            className="size-8"
            alt={activity.court.name}
            source={{ uri: undefined }}
          />
          <View className="flex-1">
            <Text className="font-bold">{activity.court.name}</Text>
            <Text className="text-xs text-muted-foreground">
              {activity.court.collegeName}
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
}
