import { CourtListEntry } from '@/types/court';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { HomeIcon, MapPinIcon, SunIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { CourtNameLabel } from './CourtNameLabel';
import { AspectRatio } from './ui/aspect-ratio';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Icon } from './ui/icon';
import { Text } from './ui/text';

export default function CourtCard({ court }: { court: CourtListEntry }) {
  return (
    <Link
      href={{
        pathname: '/(tabs)/(discover)/court/[courtId]',
        params: {
          courtId: court.id,
        },
      }}>
      <Card className="flex w-full gap-0 p-0">
        <AspectRatio ratio={2 / 1} className="relative overflow-hidden rounded-t-lg">
          <Image
            source={{
              uri: court.image,
            }}
            style={{ width: '100%', height: '100%' }}
            className="absolute inset-0 object-cover"
          />
        </AspectRatio>
        <CardContent className="flex w-full flex-col gap-4 p-4">
          <View className="flex flex-col gap-2">
            <View className="flex flex-col gap-1.5">
              <View className="flex flex-row items-center justify-between gap-4">
                <CourtNameLabel
                  className="flex-1"
                  collegeName={court.collegeName}
                  collegeColor={court.collegeColor}
                  courtName={court.name}
                  size="md"
                />
                <Badge variant="secondary">
                  <Icon size={12} as={court.indoor ? HomeIcon : SunIcon} />
                  <Text>{court.indoor ? 'Indoor' : 'Outdoor'}</Text>
                </Badge>
              </View>
              <View className="flex flex-row items-center gap-3">
                <View className="flex flex-row items-center gap-1.5">
                  {court.currentActiveSessions !== 0 && (
                    <View className="size-2 animate-pulse rounded-full bg-green-500" />
                  )}
                  <Text className="text-sm font-medium text-muted-foreground" numberOfLines={1}>
                    {court.currentActiveSessions === 0
                      ? 'No active players'
                      : `${court.currentActiveSessions} Playing Now`}{' '}
                  </Text>
                </View>
                <View className="flex flex-row items-center gap-1">
                  <Icon as={MapPinIcon} className="text-muted-foreground" size={16} />
                  <Text className="text-sm font-medium text-muted-foreground" numberOfLines={1}>
                    {court.distance.toFixed(1)} mi
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </CardContent>
        <CardFooter className="rounded-b-lg border-t border-border bg-muted/50 p-4">
          <Link
            asChild
            href={{
              pathname: '/(tabs)/(discover)/court/[courtId]',
              params: {
                courtId: court.id,
              },
            }}>
            <Button size="sm" className="w-full">
              <Text>View Court</Text>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Link>
  );
}
