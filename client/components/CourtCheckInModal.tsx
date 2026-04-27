import { THEME } from '@/lib/theme';
import { MinimalCourt } from '@/types/home';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { ClockIcon, MapPinIcon, UsersIcon, XIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { RefObject, useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { CourtNameLabel } from './CourtNameLabel';
import { useCourtSession } from './providers/CourtSessionProvider';
import { AspectRatio } from './ui/aspect-ratio';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';
import { Icon } from './ui/icon';
import { Text } from './ui/text';

export default function CourtCheckInModal({
  court,
  bottomSheetModalRef,
}: {
  court: MinimalCourt;
  bottomSheetModalRef: RefObject<BottomSheetModal | null>;
}) {
  const handlePresentModalDismissed = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.7} />
    ),
    []
  );

  const { colorScheme } = useColorScheme();

  const { activeCourtSession, checkIn, checkOut, isCheckInPending, unratedCourtSession } =
    useCourtSession();

  return (
    <BottomSheetModal
      key={`court-${court.id}-check-in-modal`}
      ref={bottomSheetModalRef}
      backdropComponent={renderBackdrop}
      containerStyle={{ marginHorizontal: 0, paddingHorizontal: 0 }}
      backgroundStyle={{
        backgroundColor: THEME[colorScheme!].background,
      }}
      handleIndicatorStyle={{ backgroundColor: THEME[colorScheme!].muted }}>
      <BottomSheetView className="flex flex-1 flex-col gap-3.5 px-4 py-8">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-2xl font-bold">Check In</Text>
          <Button
            onPress={handlePresentModalDismissed}
            className="size-7"
            size="icon"
            variant="outline">
            <Icon size={16} as={XIcon} />
          </Button>
        </View>
        <View className="flex flex-row items-center gap-4 rounded-2xl border border-border px-4 py-3">
          <AspectRatio ratio={1 / 1} className="relative h-[56px] overflow-hidden rounded-md">
            <Image
              source={{
                uri: court?.image,
              }}
              style={{ width: '100%', height: '100%' }}
              className="absolute inset-0 object-cover"
            />
          </AspectRatio>
          <View className="flex flex-1 flex-col gap-1">
            {court && (
              <CourtNameLabel
                collegeName={court.collegeName}
                collegeColor={court.collegeColor}
                courtName={court.name}
                size="sm"
                nameClassName="font-bold"
              />
            )}
            <View className="flex flex-row items-center gap-1">
              <Icon className="text-muted-foreground" size={16} as={MapPinIcon} />
              <Text className="text-sm font-medium text-muted-foreground">
                {court?.distance.toFixed(1)} mi
              </Text>
            </View>
          </View>
        </View>
        <View className="flex flex-col gap-3 rounded-2xl border border-border px-4 py-3">
          <View className="flex flex-row items-center gap-2">
            <Icon as={UsersIcon} className="text-muted-foreground" size={16} />
            <Text className="font-semibold">{court?.currentActiveSessions} Currently Playing</Text>
          </View>
          {court?.currentActiveSessions !== 0 && (
            <View className="flex flex-row flex-wrap gap-2">
              {court?.currentActiveUsers.map((user) => (
                <View
                  key={user.id}
                  className="flex flex-row items-center gap-1.5 rounded-full bg-muted p-0.5 pr-2.5">
                  <Avatar
                    className="size-6"
                    alt={`${user.name}'s image`}
                    source={{ uri: user.image }}
                  />
                  <Text className="text-sm font-semibold">{user.name.split(' ')[0]}</Text>
                </View>
              ))}
              {court?.currentActiveSessions! > court?.currentActiveUsers.length! && (
                <Text className="text-sm font-medium text-muted-foreground">
                  +{court?.currentActiveSessions! - court?.currentActiveUsers.length!} more
                </Text>
              )}
            </View>
          )}
        </View>
        <View className="flex flex-row items-center gap-1.5 rounded-2xl border border-border px-4 py-3">
          <Icon as={ClockIcon} className="text-muted-foreground" size={14} />
          <Text className="flex-1 text-sm font-medium text-muted-foreground">
            Your session timer will start when you check in.
          </Text>
        </View>
        <Button
          disabled={isCheckInPending || !!activeCourtSession || !!unratedCourtSession}
          onPress={() => checkIn(court.id)}
          size="lg"
          className="flex-1">
          <Text>Start Session</Text>
          {isCheckInPending && <ActivityIndicator />}
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
