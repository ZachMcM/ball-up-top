import { SessionFooter, useCourtSession } from '@/components/providers/CourtSessionProvider';
import { Icon } from '@/components/ui/icon';
import { BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs, useRouter } from 'expo-router';
import { Activity, MapPin, User } from 'lucide-react-native';
import { useEffect } from 'react';
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
  const router = useRouter();
  const { unratedCourtSession } = useCourtSession();

  useEffect(() => {
    if (unratedCourtSession) {
      router.navigate('/rate');
    }
  }, [unratedCourtSession]);

  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen
        name="(courts)"
        options={{
          headerShown: false,
          title: 'Courts',
          tabBarIcon: ({ color }) => <Icon as={MapPin} size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(activity)"
        options={{
          headerShown: false,
          title: 'Activity',
          tabBarIcon: ({ color }) => <Icon as={Activity} size={18} color={color} />,
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
