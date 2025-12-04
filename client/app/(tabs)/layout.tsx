import { Icon } from "@/components/ui/icon";
import { Tabs } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useColorScheme } from "nativewind";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme()

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: () => <Icon as={MapPin} />
        }}
      />
    </Tabs>
  )
}