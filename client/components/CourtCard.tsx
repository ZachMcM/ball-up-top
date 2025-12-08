import { CourtListEntry } from '@/types/court';
import { THEME } from '@/lib/theme';
import { MapPin, UsersIcon } from 'lucide-react-native';
import { Image, Platform, Pressable, View } from 'react-native';
import { AspectRatio } from './ui/aspect-ratio';
import { Icon } from './ui/icon';
import { Text } from './ui/text';
import { LineChart } from 'react-native-gifted-charts';
import { useColorScheme } from 'nativewind';
import { Linking } from 'react-native';

export default function CourtCard({ court }: { court: CourtListEntry }) {
  const { colorScheme } = useColorScheme();

  const openDirections = () => {
    const encodedAddress = encodeURIComponent(court.address);

    const url = Platform.select({
      ios: `maps:0,0?q=${encodedAddress}`, // Apple Maps
      android: `geo:0,0?q=${encodedAddress}`, // Google Maps
    });

    Linking.openURL(url!);
  };

  const getBusiestHour = () => {
    let maxIndex = 0;
    court.activityGraph.forEach(({ avgSessions }, index) => {
      if (court.activityGraph[maxIndex].avgSessions < avgSessions) {
        maxIndex = index;
      }
    });

    return maxIndex;
  };

  const getLabel = (hour: number) => {
    switch (hour + 1) {
      case 8:
        return '8am';
      case 10:
        return '10am';
      case 12:
        return '12pm';
      case 14:
        return '2pm';
      case 16:
        return '4pm';
      case 18:
        return '6pm';
      case 20:
        return '8pm';
      default:
        return undefined;
    }
  };

  return (
    <View className="flex flex-col gap-4 rounded-xl border border-border p-4">
      <View className="flex flex-row gap-4">
        <AspectRatio ratio={1 / 1} className="relative h-[72px] overflow-hidden rounded-md">
          <Image
            source={{
              uri: court.image,
            }}
            className="absolute bottom-0 left-0 right-0 top-0 object-cover"
          />
        </AspectRatio>
        <View className="flex flex-1 flex-col">
          <Text className="font-bold">{court.name}</Text>
          <Pressable onPress={() => openDirections()}>
            <Text className="text-sm font-medium text-muted-foreground">{court.address}</Text>
          </Pressable>
        </View>
      </View>
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-1.5">
          <Icon className="text-muted-foreground" size={16} as={MapPin} />
          <Text className="text-sm font-medium text-muted-foreground">
            {court.distance.toFixed(2)} mi • {court.indoor ? 'Indoor' : 'Outdoor'}
          </Text>
        </View>
        <View className="flex flex-row items-center gap-3">
          <View className="flex flex-row items-center gap-1.5">
            <View className="flex size-7 items-center justify-center rounded-full border-2 border-border">
              <Text className="text-sm font-bold">{court.avgPlayerOverall}</Text>
            </View>
            <Text className="text-sm font-medium">avg OVR</Text>
          </View>
          <View className="flex flex-row items-center gap-1.5">
            <Icon className="text-muted-foreground" size={16} as={UsersIcon} />
            <Text className="text-sm font-medium text-muted-foreground">
              {court.currentActiveSessions} playing
            </Text>
          </View>
        </View>
      </View>
      <Text className="text-xs font-medium text-muted-foreground">Average activity</Text>
      <LineChart
        isAnimated
        hideYAxisText
        height={48}
        thickness={2}
        color={THEME[colorScheme!].primary}
        dataPointsColor={THEME[colorScheme!].primary}
        dataPointsRadius={2}
        hideRules
        scrollToIndex={getBusiestHour()}
        xAxisThickness={0}
        yAxisThickness={0}
        xAxisLabelTextStyle={{
          color: THEME[colorScheme!].mutedForeground,
          fontWeight: 500,
          width: 96,
        }}
        data={court.activityGraph.map((entry, i) => ({
          value:
            process.env.NODE_ENV == 'development'
              ? i == 0
                ? 0
                : Math.random() * 50
              : entry.avgSessions,
          label: getLabel(entry.hour),
        }))}
      />
    </View>
  );
}
