import { NativewindScrollView } from '@/components/NativewindScrollView';
import { NativewindSectionList } from '@/components/NativewindSectionList';
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useTabContext } from '@/hooks/useTabContext';
import { authClient } from '@/lib/auth-client';
import { getActivity, patchActivityRead } from '@/lib/endpoints';
import { cn } from '@/lib/utils';
import { Activity } from '@/types/activity';
import { useFocusEffect } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, formatDistanceToNow, isAfter, isToday, isYesterday, subDays } from 'date-fns';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Binary,
  ChartColumnIcon,
  ChartNoAxesCombinedIcon,
  ChartPieIcon,
} from 'lucide-react-native';
import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

type ActivitySection = {
  title: 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days';
  data: Activity[];
};

type FilterType = 'all' | 'overall_change' | 'rank_change' | 'archetype_change' | 'rating';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'overall_change', label: 'Overall' },
  { key: 'rank_change', label: 'Rank' },
  { key: 'archetype_change', label: 'Archetype' },
  { key: 'rating', label: 'Rating' },
];

export default function ActivityPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

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

  const filteredActivity = useMemo(() => {
    if (!activityList) return [];
    if (activeFilter === 'all') return activityList;
    return activityList.filter((a) => a.type === activeFilter);
  }, [activityList, activeFilter]);

  const activitySections = useMemo(() => {
    if (!filteredActivity.length) return [];

    const today: Activity[] = [];
    const yesterday: Activity[] = [];
    const last7Days: Activity[] = [];
    const last30Days: Activity[] = [];

    const now = new Date();
    const sevenDaysAgo = subDays(now, 7);
    const thirtyDaysAgo = subDays(now, 30);

    filteredActivity.forEach((activity) => {
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
  }, [filteredActivity]);

  const hasActivityButFilteredEmpty =
    activityList && activityList.length > 0 && filteredActivity.length === 0;

  return (
    <View className="flex flex-1 flex-col gap-6 pt-6">
      <View className="flex flex-row items-center px-4">
        <NativewindScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
          horizontal>
          {FILTERS.map((filter) => (
            <Pressable
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              className={cn(
                'rounded-full px-4 py-1.5',
                activeFilter === filter.key ? 'bg-foreground' : 'border border-border bg-background'
              )}>
              <Text
                className={cn(
                  'text-xs font-medium',
                  activeFilter === filter.key ? 'text-background' : 'text-muted-foreground'
                )}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </NativewindScrollView>
      </View>

      <View className="flex-1">
        {activityPending ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" />
          </View>
        ) : hasActivityButFilteredEmpty ? (
          <Text className="text-center text-muted-foreground">
            No {FILTERS.find((f) => f.key === activeFilter)?.label.toLowerCase()} activity yet
          </Text>
        ) : (
          <NativewindSectionList
            ListEmptyComponent={
              <Empty>
                <EmptyTitle>No activity yet</EmptyTitle>
                <EmptyDescription>
                  Rate someone after a session and it shows up here.
                </EmptyDescription>
              </Empty>
            }
            stickySectionHeadersEnabled={false}
            sections={activitySections}
            showsVerticalScrollIndicator={false}
            SectionSeparatorComponent={() => <View className="h-3" />}
            renderSectionHeader={({ section }) => (
              <Text className="px-4 font-semibold text-muted-foreground">{section.title}</Text>
            )}
            renderItem={({ item }) => <ActivityRow activity={item} />}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </View>
  );
}

function getRelativeTime(date: Date): string {
  if (isToday(date) || isYesterday(date)) {
    const distance = formatDistanceToNow(date, { addSuffix: false });
    if (distance.includes('less than')) return 'now';
    return distance
      .replace('about ', '')
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h');
  }
  return format(date, 'MM/d/yy');
}

function ActivityRow({ activity }: { activity: Activity }) {
  const router = useRouter();
  const { data: currentUserdata } = authClient.useSession();

  const tabContext = useTabContext();

  const handlePress = () => {
    if (activity.type === 'overall_change' || activity.type === 'archetype_change') {
      router.push({
        pathname: `/(tabs)/(${tabContext})/user/[userId]` as const,
        params: { userId: currentUserdata?.user.id! },
      });
    } else if (activity.type === 'rank_change') {
      router.push({
        pathname: `/(tabs)/(${tabContext})/college/[collegeId]` as const,
        params: { collegeId: activity.rankChange?.college.id! },
      });
    } else {
      router.push({
        pathname: `/(tabs)/(${tabContext})/user/[userId]` as const,
        params: { userId: activity.rating?.rater.id! },
      });
    }
  };

  const { icon, imageUrl, descriptionComponent } = getActivityDisplay(activity);

  return (
    <Pressable
      onPress={handlePress}
      className={cn(
        'w-full flex-row items-center gap-3 px-4 py-3 active:opacity-80',
        !activity.read && 'bg-accent/30'
      )}>
      <View className="relative h-10 w-10 overflow-hidden">
        {icon ? (
          <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary">
            <Icon as={icon} size={20} className="text-primary-foreground" />
          </View>
        ) : (
          imageUrl && (
            <View className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                source={{
                  uri: imageUrl,
                }}
                style={{ width: '100%', height: '100%' }}
                className="absolute inset-0 object-cover"
              />
            </View>
          )
        )}
        {!activity.read && (
          <View className="absolute -right-0 top-0 h-2 w-2 rounded-full bg-primary" />
        )}
      </View>
      <View className="flex-1">{descriptionComponent}</View>
    </Pressable>
  );
}

function getActivityDisplay(activity: Activity): {
  icon?: typeof Binary;
  imageUrl?: string;
  descriptionComponent: ReactNode;
} {
  if (activity.type === 'overall_change' && activity.rating) {
    const delta = activity.rating.rateeNewOverall - activity.rating.rateeOldOverall;
    const isPositive = delta > 0;
    const colorClass = isPositive ? 'text-green-400' : 'text-destructive';
    return {
      icon: ChartColumnIcon,
      descriptionComponent: (
        <Text className="leading-[22px]">
          <Text>Your </Text>
          <Text className="font-semibold">OVR</Text>
          <Text>
            {' '}
            went {isPositive ? 'up' : 'down'} to{'  '}
          </Text>
          <Text className="font-bebas text-2xl tabular-nums">
            {activity.rating.rateeNewOverall}
            <Text className={cn('text-lg', colorClass)}>
              {'   '}({isPositive ? '+' : ''}
              {delta}){'    '}
            </Text>
          </Text>
          <Text className="text-[13px] font-medium text-muted-foreground">
            {getRelativeTime(new Date(activity.createdAt))}
          </Text>
        </Text>
      ),
    };
  }

  if (activity.type === 'rank_change' && activity.rankChange) {
    const delta = activity.rankChange.oldRank - activity.rankChange.newRank;
    const isPositive = delta > 0;
    const colorClass = isPositive ? 'text-green-400' : 'text-destructive';
    return {
      icon: ChartNoAxesCombinedIcon,
      descriptionComponent: (
        <Text className="leading-[22px]">
          <Text>Your </Text>
          <Text className="font-semibold">Rank</Text>
          <Text>
            {' '}
            went {isPositive ? 'up' : 'down'} to{'  '}
          </Text>
          <Text className="font-bebas text-2xl tabular-nums">
            #{activity.rankChange.newRank}
            <Text className={cn('text-lg', colorClass)}>
              {'   '}({isPositive ? '+' : ''}
              {delta}){'    '}
            </Text>
          </Text>
          <Text>
            at {activity.rankChange.college.name}
            {'  '}
          </Text>
          <Text className="text-[13px] font-medium text-muted-foreground">
            {getRelativeTime(new Date(activity.createdAt))}
          </Text>
        </Text>
      ),
    };
  }

  if (activity.type === 'archetype_change' && activity.rating) {
    return {
      icon: ChartPieIcon,
      descriptionComponent: (
        <Text className="leading-[22px]">
          <Text>Your </Text>
          <Text className="font-semibold">Overall </Text>
          <Text>changed from </Text>
          <Text className="font-bebas text-xl tabular-nums text-muted-foreground">
            {activity.rating.rateeOldArchetype}{' '}
          </Text>
          <Text>to </Text>
          <Text className="font-bebas text-xl tabular-nums">
            {activity.rating.rateeNewArchetype}
            {'   '}
          </Text>
          <Text className="text-[13px] font-medium text-muted-foreground">
            {getRelativeTime(new Date(activity.createdAt))}
          </Text>
        </Text>
      ),
    };
  }

  if (activity.type === 'rating' && activity.rating) {
    return {
      imageUrl: activity.rating.rater.image,
      descriptionComponent: (
        <Text className="leading-[22px]">
          <Text>You received a rating from </Text>
          <Text className="font-semibold">{activity.rating.rater.name} </Text>
          <Text>
            at {activity.rating.rateeCourtSession.court.name}
            {'  '}
          </Text>
          <Text className="text-[13px] font-medium text-muted-foreground">
            {getRelativeTime(new Date(activity.createdAt))}
          </Text>
        </Text>
      ),
    };
  }

  return {
    icon: Binary,
    descriptionComponent: <Text className="text-sm text-muted-foreground">Activity</Text>,
  };
}
