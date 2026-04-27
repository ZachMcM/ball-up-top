import { SessionFooter, useCourtSession } from '@/components/providers/CourtSessionProvider';
import { Icon } from '@/components/ui/icon';
import { getActivity } from '@/lib/endpoints';
import { THEME } from '@/lib/theme';
import { BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useQuery } from '@tanstack/react-query';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Activity, Home as HomeIcon, SearchIcon, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';

// How long to wait before re-prompting after user dismisses (in ms)
const REPROMPT_DELAY = 30_000; // 30 seconds

function CustomTabBar(props: BottomTabBarProps) {
  return (
    <View>
      <SessionFooter />
      <BottomTabBar {...props} />
    </View>
  );
}

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { unratedCourtSession } = useCourtSession();
  const lastPromptTime = useRef<number>(0);

  const { data: activityList } = useQuery({
    queryKey: ['activity'],
    queryFn: getActivity,
  });

  const unreadCount = activityList?.filter((a) => !a.read).length ?? 0;

  useEffect(() => {
    if (!unratedCourtSession) {
      lastPromptTime.current = 0;
      return;
    }

    const isOnRatePage = pathname === '/rate';

    // If already on rate page, don't re-navigate
    if (isOnRatePage) {
      return;
    }

    // Check if enough time has passed since last prompt
    const now = Date.now();
    const timeSinceLastPrompt = now - lastPromptTime.current;

    if (lastPromptTime.current === 0 || timeSinceLastPrompt >= REPROMPT_DELAY) {
      lastPromptTime.current = now;
      router.navigate('/rate');
    } else {
      // Set up timer to re-prompt after remaining delay
      const remainingDelay = REPROMPT_DELAY - timeSinceLastPrompt;
      const timer = setTimeout(() => {
        if (unratedCourtSession) {
          lastPromptTime.current = Date.now();
          router.navigate('/rate');
        }
      }, remainingDelay);

      return () => clearTimeout(timer);
    }
  }, [unratedCourtSession, pathname]);

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
        name="(discover)"
        options={{
          headerShown: false,
          title: 'Discover',
          tabBarIcon: ({ color }) => <Icon as={SearchIcon} size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(activity)"
        options={{
          headerShown: false,
          title: 'Activity',
          tabBarIcon: ({ color }) => <Icon as={Activity} size={18} color={color} />,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: THEME[colorScheme!].primary,
            color: THEME[colorScheme!].primaryForeground,
            fontWeight: 700,
            fontSize: 12
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
