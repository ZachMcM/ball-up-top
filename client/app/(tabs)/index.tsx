import CourtCard from '@/components/CourtCard';
import { NativewindFlatList } from '@/components/NativewindFlatList';
import { NativewindScrollView } from '@/components/NativewindScrollView';
import { useLocation } from '@/components/providers/LocationProvider';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '@/components/ui/empty';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { getCourts } from '@/lib/endpoints';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { PlusCircle, SlidersHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useDebounce } from 'use-debounce';

export default function Courts() {
  const { location, isLocationPending } = useLocation();
  const [isIndoor, setIsIndoor] = useState<boolean | undefined>(undefined);
  const [isVerified, setIsVerified] = useState<boolean | undefined>(true);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 250);

  const { data: courts, isPending: areCourtsPending } = useQuery({
    queryKey: [
      'courts',
      {
        lat: location?.coords.latitude!,
        lng: location?.coords.longitude!,
        isIndoor,
        isVerified,
        searchQuery: debouncedSearchQuery,
      },
    ],
    queryFn: async () => {
      const courts = await getCourts({
        lat: location?.coords.latitude!,
        lng: location?.coords.longitude!,
        verified: isVerified,
        indoor: isIndoor,
        searchQuery: debouncedSearchQuery,
      });
      return courts;
    },
    enabled: !!location,
    staleTime: 1000 * 60,
  });

  const isLoading = isLocationPending || areCourtsPending;

  function handleIndoorOutdoorToggle(pressed: 'indoor' | 'outdoor') {
    const newValue = pressed === 'indoor' ? true : false;
    setIsIndoor(isIndoor === newValue ? undefined : newValue);
  }

  function handleVerifiedToggle() {
    setIsVerified((prev) => (prev ? undefined : true));
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <View className="flex w-full flex-col gap-6 px-4 py-6">
        <View className="flex w-full flex-col gap-3">
          <View className="flex flex-row items-center gap-3">
            <Icon as={SlidersHorizontal} size={18} />
            <NativewindScrollView
              horizontal
              contentContainerClassName="flex flex-row items-center gap-1.5"
              showsHorizontalScrollIndicator={false}>
              <Button
                onPress={() => handleIndoorOutdoorToggle('indoor')}
                variant={isIndoor ? 'secondary' : 'outline'}
                size="sm"
                className="rounded-full border border-border">
                <Text>Indoor</Text>
              </Button>
              <Button
                onPress={() => handleIndoorOutdoorToggle('outdoor')}
                variant={isIndoor === false ? 'secondary' : 'outline'}
                size="sm"
                className="rounded-full border border-border">
                <Text>Outdoor</Text>
              </Button>
              <Button
                onPress={() => handleVerifiedToggle()}
                variant={isVerified ? 'secondary' : 'outline'}
                size="sm"
                className="rounded-full border border-border">
                <Text>Verified</Text>
              </Button>
            </NativewindScrollView>
          </View>
          <Input
            value={searchQuery}
            onChangeText={(val) => {
              setSearchQuery(val);
            }}
            className="rounded-full"
            placeholder="Search for a court..."
          />
        </View>
        {isLoading ? (
          <ActivityIndicator />
        ) : courts && courts.length !== 0 ? (
          <NativewindFlatList
            contentContainerClassName="flex flex-col gap-4 pb-32"
            data={courts}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <CourtCard court={item} />}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Empty className="border border-dashed border-border">
            <EmptyHeader>
              <EmptyTitle>No Courts Found</EmptyTitle>
              <EmptyDescription>
                No courts were found with those filters. Try a different search or adding a new
                court.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onPress={() => router.navigate('/add-court')} size="sm">
                <Text>Add Court</Text>
                <Icon size={16} className="text-primary-foreground" as={PlusCircle} />
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
