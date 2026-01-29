import { NativewindSectionList } from '@/components/NativewindSectionList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { getActivity, patchActivityRead } from '@/lib/endpoints';
import { timeAgo } from '@/lib/utils';
import { Activity } from '@/types/activity';
import { useFocusEffect } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isToday, isYesterday, subDays, isAfter } from 'date-fns';
import { Link, useRouter } from 'expo-router';
import { Award, BanIcon, MapPin, TrendingUp } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';

type ActivitySection = {
  title: 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days';
  data: Activity[];
};

export default function ActivityPage() {
  const queryClient = useQueryClient();
  const { data: activityList, isPending: activityPending } = useQuery({
    queryKey: ['activity'],
    queryFn: getActivity,
  });

  const router = useRouter();

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
                <Button onPress={() => router.navigate('/(tabs)/(discover)')} size="sm">
                  <Text>View Courts</Text>
                </Button>
              </EmptyContent>
            </Empty>
          </View>
        ) : (
          <NativewindSectionList
            contentContainerClassName="pb-8"
            sections={activitySections}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({ section }) => (
              <View className="px-4 py-3">
                <Text className="text-base font-bold">{section.title}</Text>
              </View>
            )}
            renderItem={({ item }) => <ActivityRow activity={item} />}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function ActivityRow({ activity }: { activity: Activity }) {
  switch (activity.type) {
    case 'rating_received':
      return <RatingReceivedRow activity={activity} />;
    case 'session_completed':
      return <SessionCompletedRow activity={activity} />;
    case 'rating_milestone':
      return <RatingMilestoneRow activity={activity} />;
    case 'archetype_changed':
      return <ArchetypeChangedRow activity={activity} />;
    case 'court_activity':
      return <CourtActivityRow activity={activity} />;
    default:
      return null;
  }
}

function RatingReceivedRow({ activity }: { activity: Activity }) {
  const rating = activity.rating!;
  const rater = rating.rater;

  return (
    <Link
      href={{
        pathname: '/user/[userId]',
        params: { userId: rater.id },
      }}>
      <View className="flex flex-row items-center gap-3 px-4 py-3">
        <Avatar alt={rater.name} className="size-12">
          <AvatarImage source={{ uri: rater.image }} />
          <AvatarFallback>
            <Text>{rater.name.substring(0, 2).toUpperCase()}</Text>
          </AvatarFallback>
        </Avatar>
        <View className="flex-1">
          <Text className="leading-5">
            <Text className="font-bold">{rater.name}</Text>
            <Text>
              {' '}
              rated you a{' '}
              {(
                (rating.defenseRating +
                  rating.playmakingRating +
                  rating.shootingRating +
                  rating.finishingRating) /
                4
              ).toFixed(0)}{' '}
              overall
            </Text>
          </Text>
          <Text className="text-sm text-muted-foreground">{timeAgo(rating.createdAt)}</Text>
        </View>
      </View>
    </Link>
  );
}

function SessionCompletedRow({ activity }: { activity: Activity }) {
  const session = activity.courtSession!;
  const court = session.court;

  const startTime = new Date(session.startTime);
  const endTime = session.endTime ? new Date(session.endTime) : null;
  const durationStr = (() => {
    if (!endTime) return '';
    const minutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  })();

  return (
    <Link
      href={{
        pathname: '/court/[courtId]',
        params: { courtId: court.id },
      }}>
      <View className="flex flex-row items-center gap-3 px-4 py-3">
        <Avatar alt={court.name} className="size-12 rounded-lg">
          <AvatarImage source={{ uri: court.image }} />
          <AvatarFallback>
            <Icon as={MapPin} size={22} />
          </AvatarFallback>
        </Avatar>
        <View className="flex-1">
          <Text className="leading-5">
            <Text>You played at</Text>
            <Text className="font-bold"> {court.name} </Text>
            <Text>for {durationStr}</Text>
          </Text>
          <Text className="text-sm text-muted-foreground">{timeAgo(session.startTime)}</Text>
        </View>
      </View>
    </Link>
  );
}

function RatingMilestoneRow({ activity }: { activity: Activity }) {
  const rating = activity.rating!;
  const milestone = rating.rateeNewOverall;

  return (
    <View className="flex flex-row items-center gap-3 px-4 py-3">
      <View className="size-12 items-center justify-center rounded-full border border-border bg-muted/30">
        <Icon as={Award} size={22} />
      </View>
      <View className="flex-1">
        <Text className="leading-5">
          <Text>Reached </Text>
          <Text className="font-bold">{milestone} overall!</Text>
          <Text> Keep up the great work</Text>
        </Text>
        <Text className="text-sm text-muted-foreground">{timeAgo(rating.createdAt)}</Text>
      </View>
    </View>
  );
}

function ArchetypeChangedRow({ activity }: { activity: Activity }) {
  const rating = activity.rating!;

  return (
    <View className="flex flex-row items-center gap-3 px-4 py-3">
      <View className="size-12 items-center justify-center rounded-full border border-border bg-muted/30">
        <Icon as={TrendingUp} size={22} />
      </View>
      <View className="flex-1">
        <Text className="leading-5">
          <Text>Archetype changed to </Text>
          <Text className="font-bold">{rating.rateeNewArchetype}</Text>
        </Text>
        <Text className="text-sm text-muted-foreground">{timeAgo(rating.createdAt)}</Text>
      </View>
    </View>
  );
}

function CourtActivityRow({ activity }: { activity: Activity }) {
  const court = activity.court!;
  const playerCount = court.currentActiveSessions;

  return (
    <Link
      href={{
        pathname: '/court/[courtId]',
        params: { courtId: court.id },
      }}>
      <View className="flex flex-row items-center gap-3 px-4 py-3">
        <Icon as={MapPin} size={18} />
        <View className="flex-1">
          <Text className="leading-5">
            <Text className="font-bold">{court.name}</Text>
            <Text>
              {playerCount === 0
                ? ' has no active players'
                : ` has ${playerCount} ${playerCount === 1 ? 'player' : 'players'} active`}
            </Text>
          </Text>
          <Text className="text-sm text-muted-foreground">{timeAgo(activity.createdAt)}</Text>
        </View>
        <Avatar alt={court.name} className="size-12 rounded-lg">
          <AvatarImage source={{ uri: court.image }} />
          <AvatarFallback>
            <Icon as={MapPin} size={22} />
          </AvatarFallback>
        </Avatar>
      </View>
    </Link>
  );
}
