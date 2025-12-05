import { Icon } from '@/components/ui/icon';
import { Tabs } from 'expo-router';
import { Activity, MapPin, User } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          height: 64
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Courts',
          tabBarIcon: ({ color }) => <Icon as={MapPin} size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <Icon as={Activity} size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon as={User} size={19} color={color} />,
        }}
      />
    </Tabs>
  );
}
