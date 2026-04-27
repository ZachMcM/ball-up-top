import { useTabContext } from '@/hooks/useTabContext';
import { timeAgo } from '@/lib/utils';
import { UserSession } from '@/types/user';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';
import { CourtNameLabel } from './CourtNameLabel';
import { AspectRatio } from './ui/aspect-ratio';
import { Icon } from './ui/icon';
import { Separator } from './ui/separator';
import { Text } from './ui/text';

function durationLabel(startTime: string, endTime: string | null): string {
  if (!endTime) return 'In progress';
  const minutes = Math.round(
    (new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)
  );
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function RecentSessionCard({ session }: { session: UserSession }) {
  const tabContext = useTabContext();
  const { court, startTime, endTime } = session;

  return (
    <>
      <Link
        href={{
          pathname: `/(tabs)/(${tabContext})/court/[courtId]` as const,
          params: { courtId: court.id },
        }}
        className="w-full">
        <View className="flex flex-row items-center justify-between">
          <View className="flex w-full flex-row items-center gap-3 flex-1">
            <AspectRatio ratio={1 / 1} className="relative h-[48px] overflow-hidden rounded-md">
              <Image
                source={{ uri: court.image }}
                style={{ width: '100%', height: '100%' }}
                className="absolute inset-0 object-cover"
              />
            </AspectRatio>
            <View className="flex flex-1 flex-col gap-0.5">
              <CourtNameLabel
                collegeName={court.collegeName}
                collegeColor={court.collegeColor}
                courtName={court.name}
                size="md"
              />
              <Text className="text-xs font-medium text-muted-foreground">
                {durationLabel(startTime, endTime)} • {timeAgo(startTime)}
              </Text>
            </View>
          </View>
          <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
        </View>
      </Link>
      <Separator />
    </>
  );
}
