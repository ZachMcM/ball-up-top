import { SessionFooter } from '@/components/providers/CourtSessionProvider';
import { Icon } from '@/components/ui/icon';
import { getActivity } from '@/lib/endpoints';
import { THEME } from '@/lib/theme';
import { BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useQuery } from '@tanstack/react-query';
import { Tabs } from 'expo-router';
import {
  ActivityIcon,
  ChartLineIcon,
  Home as HomeIcon,
  User
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

function CustomTabBar(props: BottomTabBarProps) {
  return (
    <View>
      <SessionFooter />
      <BottomTabBar {...props} />
    </View>
  );
}

export default function TabsLayout() {
  const { data: activityList } = useQuery({
    queryKey: ['activity'],
    queryFn: getActivity,
  });

  const unreadCount = activityList?.filter((a) => !a.read).length ?? 0;

  const { colorScheme } = useColorScheme();

  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon as={HomeIcon} size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(leaderboard)"
        options={{
          headerShown: false,
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <Icon as={ChartLineIcon} size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(activity)"
        options={{
          headerShown: false,
          title: 'Activity',
          tabBarIcon: ({ color }) => <Icon as={ActivityIcon} size={18} color={color} />,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: THEME[colorScheme!].primary,
            color: THEME[colorScheme!].primaryForeground,
            fontWeight: 700,
            fontSize: 12,
          },
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon as={User} size={19} color={color} />,
        }}
      />
    </Tabs>
  );
}
