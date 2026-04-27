import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CheckIcon, HomeIcon, SunIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

interface CourtsFiltersContentProps {
  filters: {
    isIndoor?: boolean;
    sortBy?: 'distance' | 'active_players';
  };
  onChange: (filters: CourtsFiltersContentProps['filters']) => void;
}

export function CourtsFiltersContent({ filters, onChange }: CourtsFiltersContentProps) {
  const {
    isIndoor,
    sortBy,
  } = filters;

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
              sortBy: sortBy === 'active_players' ? undefined : 'active_players',
            })
          }
          className="flex flex-row items-center justify-between py-3">
          <Text className="text-base">Most Players</Text>
          <View
            className={`size-6 items-center justify-center rounded-full border-2 ${
              sortBy === 'active_players' ? 'border-primary' : 'border-muted-foreground'
            }`}>
            {sortBy === 'active_players' && <View className="size-3.5 rounded-full bg-primary" />}
          </View>
        </Pressable>
      </View>
    </>
  );
}
