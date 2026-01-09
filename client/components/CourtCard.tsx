import { CourtListEntry } from '@/types/court';
import { Link } from 'expo-router';
import {
  HomeIcon,
  MapPinIcon,
  StarIcon,
  SunIcon,
  UsersIcon,
  VerifiedIcon,
} from 'lucide-react-native';
import { Image, View } from 'react-native';
import { AspectRatio } from './ui/aspect-ratio';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Icon } from './ui/icon';
import { Text } from './ui/text';

function getCityState(address: string): string {
  const parts = address.split(',').map((p) => p.trim());
  if (parts.length >= 2) {
    const city = parts[parts.length - 2];
    const stateZip = parts[parts.length - 1];
    // Extract just the state abbreviation (first 2 letters after trimming)
    const state = stateZip.split(' ')[0];
    return `${city}, ${state}`;
  }
  return address;
}

export default function CourtCard({ court }: { court: CourtListEntry }) {
  return (
    <Link
      href={{
        pathname: '/(tabs)/(discover)/court/[courtId]',
        params: {
          courtId: court.id,
        },
      }}>
      <Card className="flex w-full flex-col gap-4 p-4">
        <AspectRatio ratio={2 / 1} className="relative overflow-hidden rounded-lg">
          <Image
            source={{
              uri: court.image,
            }}
            style={{ width: '100%', height: '100%' }}
            className="absolute inset-0 object-cover"
          />
        </AspectRatio>
        <View className="flex flex-col gap-2">
          <View className="flex flex-col">
            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg font-semibold">{court.name}</Text>
              <Text className="font-medium text-muted-foreground">
                {court.distance.toFixed(1)} mi
              </Text>
            </View>
            <View className="flex flex-row items-center gap-1.5">
              <Icon as={MapPinIcon} className="text-muted-foreground" size={14} />
              <Text className="text-sm font-medium text-muted-foreground" numberOfLines={1}>
                {getCityState(court.address)}
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Icon as={UsersIcon} size={16} className="text-muted-foreground" />
            <Text className="font-medium text-muted-foreground">
              {court.currentActiveSessions === 0
                ? 'No active players'
                : `${court.currentActiveSessions} Playing Now`}
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center gap-1">
          {court.popular && (
            <Badge variant="outline">
              <Icon size={12} as={StarIcon} />
              <Text>Popular</Text>
            </Badge>
          )}
          <Badge variant="outline">
            <Icon size={12} as={court.indoor ? HomeIcon : SunIcon} />
            <Text>{court.indoor ? 'Indoor' : 'Outdoor'}</Text>
          </Badge>
          {court.verified && (
            <Badge variant="outline">
              <Icon size={12} as={VerifiedIcon} />
              <Text>Verified</Text>
            </Badge>
          )}
        </View>
      </Card>
    </Link>
  );
}
