import { CourtListEntry } from '@/types/court';
import { ChartColumnIcon, MapPin, UsersIcon } from 'lucide-react-native';
import { Image, View } from 'react-native';
import { AspectRatio } from './ui/aspect-ratio';
import { Icon } from './ui/icon';
import { Text } from './ui/text';

export default function CourtCard({ court }: { court: CourtListEntry }) {
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
          {/* TODO link to maps */}
          <Text className="text-sm font-medium text-muted-foreground underline">
            {court.address}
          </Text>
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
    </View>
  );
}
