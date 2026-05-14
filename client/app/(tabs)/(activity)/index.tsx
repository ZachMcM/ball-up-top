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
import { getActivity, patchActivityRead } from '@/lib/endpoints';
import { Activity } from '@/types/activity';
import { useFocusEffect } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAfter, isToday, isYesterday, subDays } from 'date-fns';
import { useRouter } from 'expo-router';
import {
  BanIcon
} from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';

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
                <View className="py-3">
                  <Text className="text-base font-bold">{section.title}</Text>
                </View>
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

function ActivityCard({ activity }: { activity: Activity }) {
  const router = useRouter(); 
}
