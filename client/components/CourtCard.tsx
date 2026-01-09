import { CourtListEntry } from '@/types/court';
// import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import {
  ChevronRight,
  HouseIcon,
  MapPinIcon,
  SunIcon,
  UsersIcon,
  VerifiedIcon,
} from 'lucide-react-native';
import { Image, View } from 'react-native';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Icon } from './ui/icon';
import { Text } from './ui/text';
import { Button } from './ui/button';

export default function CourtCard({ court }: { court: CourtListEntry }) {
  const router = useRouter();

  return (
    <Link
      href={{
        pathname: '/(tabs)/(courts)/court/[courtId]',
        params: {
          courtId: court.id,
        },
      }}>
      <Card className="flex w-full flex-col gap-0 p-0">
        <View className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl bg-muted">
          <Image
            source={{
              uri: court.image,
            }}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <View className="absolute flex w-full flex-row items-center justify-between p-4">
            <Badge variant="secondary" className='gap-1.5'>
              <Icon size={16} className="text-secondary-foreground" as={court.indoor ? HouseIcon : SunIcon} />
              <Text className='text-sm'>{court.indoor ? 'Indoor' : 'Outdoor'}</Text>
            </Badge>
            <Badge variant="secondary">
              <Text className='text-sm'>{court.distance.toFixed(1)} mi</Text>
            </Badge>
          </View>
        </View>
        <View className="flex flex-row justify-between gap-6 p-4">
          <View className="flex flex-1 flex-col gap-4">
            <View className="flex flex-col gap-1">
              <Text className="font-semibold text-lg">{court.name}</Text>
              <View className="flex flex-row items-center gap-2">
                <View className="flex w-full flex-1 flex-row items-center gap-1.5">
                  <Icon as={MapPinIcon} className="text-muted-foreground" size={14} />
                  <Text numberOfLines={1} className="flex-1 text-sm text-muted-foreground">
                    {court.address}
                  </Text>
                </View>
              </View>
            </View>
            <Badge variant="secondary" className="gap-2 self-start px-2.5 py-1">
              <Icon as={UsersIcon} size={16} className='text-primary' />
              <Text className="text-sm">
                {court.currentActiveSessions === 0
                  ? 'No active runs'
                  : `${court.currentActiveSessions} Playing Now`}
              </Text>
            </Badge>
          </View>
          <Button
            onPress={() =>
              router.navigate({
                pathname: '/(tabs)/(courts)/court/[courtId]',
                params: {
                  courtId: court.id,
                },
              })
            }
            variant="ghost"
            size="icon">
            <Icon size={20} as={ChevronRight} />
          </Button>
        </View>
      </Card>
    </Link>
  );
}
