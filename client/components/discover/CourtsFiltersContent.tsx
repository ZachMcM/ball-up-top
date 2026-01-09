import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CheckIcon, HomeIcon, SunIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

interface CourtsFiltersContentProps {
  filters: {
    isIndoor?: boolean;
    isBookmarked?: true;
    isPopular?: true;
    sortBy?: 'distance' | 'activeCount';
  };
  onChange: (filters: CourtsFiltersContentProps['filters']) => void;
}

export function CourtsFiltersContent({ filters, onChange }: CourtsFiltersContentProps) {
  const { isIndoor, isBookmarked, isPopular, sortBy } = filters;

  return (
    <>
      <View className="flex flex-col gap-4 border-b border-border px-4 py-5">
        <Text className="text-lg font-bold">Court Type</Text>
        <View className="flex flex-row gap-2">
          <Button
            onPress={() =>
              onChange({
                ...filters,
                isIndoor: isIndoor === true ? undefined : true,
              })
            }
            variant={isIndoor === true ? 'secondary' : 'outline'}
            className="flex-1">
            <Icon as={HomeIcon} size={16} />
            <Text>Indoor</Text>
          </Button>
          <Button
            onPress={() =>
              onChange({
                ...filters,
                isIndoor: isIndoor === false ? undefined : false,
              })
            }
            variant={isIndoor === false ? 'secondary' : 'outline'}
            className="flex-1">
            <Icon as={SunIcon} size={16} />
            <Text>Outdoor</Text>
          </Button>
        </View>
      </View>
      <View className="flex flex-col gap-2 border-b border-border px-4 py-5">
        <Text className="text-lg font-bold">Filters</Text>
        <Pressable
          onPress={() =>
            onChange({
              ...filters,
              isPopular: isPopular ? undefined : true,
            })
          }
          className="flex flex-row items-center justify-between py-3">
          <Text className="text-base">Popular</Text>
          <View
            className={`size-6 items-center justify-center rounded-md border-2 ${
              isPopular ? 'border-primary bg-primary' : 'border-muted-foreground'
            }`}>
            {isPopular && <Icon as={CheckIcon} size={16} className="text-primary-foreground" />}
          </View>
        </Pressable>
        <Pressable
          onPress={() =>
            onChange({
              ...filters,
              isBookmarked: isBookmarked ? undefined : true,
            })
          }
          className="flex flex-row items-center justify-between py-3">
          <Text className="text-base">Bookmarked</Text>
          <View
            className={`size-6 items-center justify-center rounded-md border-2 ${
              isBookmarked ? 'border-primary bg-primary' : 'border-muted-foreground'
            }`}>
            {isBookmarked && <Icon as={CheckIcon} size={16} className="text-primary-foreground" />}
          </View>
        </Pressable>
      </View>
      <View className="flex flex-col gap-2 px-4 py-5">
        <Text className="text-lg font-bold">Sort</Text>
        <Pressable
          onPress={() =>
            onChange({
              ...filters,
              sortBy: sortBy === 'distance' ? undefined : 'distance',
            })
          }
          className="flex flex-row items-center justify-between py-3">
          <Text className="text-base">Distance</Text>
          <View
            className={`size-6 items-center justify-center rounded-full border-2 ${
              sortBy === 'distance' ? 'border-primary' : 'border-muted-foreground'
            }`}>
            {sortBy === 'distance' && <View className="size-3.5 rounded-full bg-primary" />}
          </View>
        </Pressable>
        <Pressable
          onPress={() =>
            onChange({
              ...filters,
              sortBy: sortBy === 'activeCount' ? undefined : 'activeCount',
            })
          }
          className="flex flex-row items-center justify-between py-3">
          <Text className="text-base">Most Players</Text>
          <View
            className={`size-6 items-center justify-center rounded-full border-2 ${
              sortBy === 'activeCount' ? 'border-primary' : 'border-muted-foreground'
            }`}>
            {sortBy === 'activeCount' && <View className="size-3.5 rounded-full bg-primary" />}
          </View>
        </Pressable>
      </View>
    </>
  );
}
