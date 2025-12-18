import { Icon } from '@/components/ui/icon';
import { Tabs, usePathname } from 'expo-router';
import { Activity, MapPin, User } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs>
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
