import { openDirections } from '@/lib/utils';
import { CourtListEntry } from '@/types/court';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { HouseIcon, MapPin, SunIcon, UsersIcon, VerifiedIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import ActivityGraph from './ActivityGraph';
import { AspectRatio } from './ui/aspect-ratio';
import { Button } from './ui/button';
import { Icon } from './ui/icon';
import { Text } from './ui/text';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function CourtCard({ court }: { court: CourtListEntry }) {
  return (
    <Link
      href={{
        pathname: '/(tabs)/(courts)/court/[courtId]',
        params: {
          courtId: court.id,
        },
      }}>
      <View className="flex w-full flex-col gap-4 rounded-xl border border-border p-4">
        <View className="flex flex-row gap-4">
          <AspectRatio ratio={1 / 1} className="relative h-[72px] overflow-hidden rounded-md">
            <Image
              source={{
                uri: court.image,
              }}
              style={{ width: '100%', height: '100%' }}
              className="absolute inset-0 object-cover"
            />
          </AspectRatio>
          <View className="flex flex-1 flex-col gap-0.5">
            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg font-bold">{court.name}</Text>
              <View className="flex flex-row items-center gap-1.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="size-7" size="icon">
                      <Icon as={court.indoor ? HouseIcon : SunIcon} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text>Court is {court.indoor ? 'indoor' : 'outdoor'}.</Text>
                  </TooltipContent>
                </Tooltip>
                {court.verified && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="size-7 bg-blue-500 active:bg-blue-500 dark:bg-blue-600 dark:active:bg-blue-600/90"
                        size="icon">
                        <Icon className="text-white" as={VerifiedIcon} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <Text>Court is verified.</Text>
                    </TooltipContent>
                  </Tooltip>
                )}
              </View>
            </View>
            <Pressable onPress={() => openDirections(court.address)}>
              <Text className="text-sm font-medium text-muted-foreground">{court.address}</Text>
            </Pressable>
          </View>
        </View>
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-1.5">
            <Icon className="text-muted-foreground" size={16} as={MapPin} />
            <Text className="text-sm font-medium text-muted-foreground">
              {court.distance.toFixed(1)} mi
            </Text>
          </View>
          <View className="flex flex-row items-center gap-4">
            <View className="flex flex-row items-center gap-1.5">
              <Icon className="text-muted-foreground" size={16} as={UsersIcon} />
              <Text className="text-sm font-medium text-muted-foreground">
                {court.currentActiveSessions} Playing
              </Text>
            </View>
            {court.currentActiveSessions !== 0 && (
              <View className="flex flex-row items-center gap-1.5">
                <View className="flex size-8 items-center justify-center rounded-full border border-border bg-muted/30">
                  <Text className="text-sm font-bold">{court.avgPlayerOverall}</Text>
                </View>
                <Text className="text-sm font-medium">Average OVR</Text>
              </View>
            )}
          </View>
        </View>
        <Text className="text-xs font-medium text-muted-foreground">Average activity</Text>
        <ActivityGraph height={32} points={court.activityGraph} />
      </View>
    </Link>
  );
}
