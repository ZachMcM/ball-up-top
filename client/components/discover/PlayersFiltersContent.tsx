import { Input } from '@/components/ui/input';
import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';

interface PlayersFiltersContentProps {
  filters: {
    minHeight?: string;
    maxHeight?: string;
    minOverall?: number;
    sortBy?: 'most_active' | 'overall_desc' | 'overall_asc';
  };
  onChange: (filters: PlayersFiltersContentProps['filters']) => void;
}

const generateHeightOptions = () => {
  const options: { label: string; value: string }[] = [];
  for (let feet = 4; feet <= 8; feet++) {
    const maxInches = feet === 8 ? 0 : 11;
    for (let inches = 0; inches <= maxInches; inches++) {
      const label = `${feet}'${inches}"`;
      options.push({ label, value: label });
    }
  }
  return options;
};

const HEIGHT_OPTIONS = generateHeightOptions();

export function PlayersFiltersContent({ filters, onChange }: PlayersFiltersContentProps) {
  const { minHeight, maxHeight, minOverall, sortBy } = filters;

  return (
    <>
      <View className="flex flex-col gap-4 border-b border-border px-4 py-5">
        <Text className="text-lg font-bold">Height Range</Text>
        <View className="flex flex-row gap-2">
          <View className="flex-1">
            <Text className="mb-2 text-sm text-muted-foreground">Min</Text>
            <Select
              value={minHeight ? { value: minHeight, label: minHeight } : undefined}
              onValueChange={(option) =>
                onChange({
                  ...filters,
                  minHeight: option?.value,
                })
              }>
              <SelectTrigger className="w-full rounded-full">
                <SelectValue placeholder="Select min" />
              </SelectTrigger>
              <SelectContent>
                <NativeSelectScrollView>
                  {HEIGHT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} label={option.label} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </NativeSelectScrollView>
              </SelectContent>
            </Select>
          </View>
          <View className="flex-1">
            <Text className="mb-2 text-sm text-muted-foreground">Max</Text>
            <Select
              value={maxHeight ? { value: maxHeight, label: maxHeight } : undefined}
              onValueChange={(option) =>
                onChange({
                  ...filters,
                  maxHeight: option?.value,
                })
              }>
              <SelectTrigger className="w-full rounded-full">
                <SelectValue placeholder="Select max" />
              </SelectTrigger>
              <SelectContent>
                <NativeSelectScrollView>
                  {HEIGHT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} label={option.label} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </NativeSelectScrollView>
              </SelectContent>
            </Select>
          </View>
        </View>
      </View>
      <View className="flex flex-col gap-4 border-b border-border px-4 py-5">
        <Text className="text-lg font-bold">Minimum Overall</Text>
        <Input
          keyboardType="numeric"
          placeholder="60"
          className='rounded-full'
          value={minOverall?.toString() ?? ''}
          onChangeText={(text) =>
            onChange({
              ...filters,
              minOverall: text ? parseInt(text, 10) : undefined,
            })
          }
        />
      </View>
      <View className="flex flex-col gap-2 px-4 py-5">
        <Text className="text-lg font-bold">Sort</Text>
        <Pressable
          onPress={() =>
            onChange({
              ...filters,
              sortBy: sortBy === 'most_active' ? undefined : 'most_active',
            })
          }
          className="flex flex-row items-center justify-between py-3">
          <Text className="text-base">Most Active</Text>
          <View
            className={`size-6 items-center justify-center rounded-full border-2 ${
              sortBy === 'most_active' ? 'border-primary' : 'border-muted-foreground'
            }`}>
            {sortBy === 'most_active' && <View className="size-3.5 rounded-full bg-primary" />}
          </View>
        </Pressable>
        <Pressable
          onPress={() =>
            onChange({
              ...filters,
              sortBy: sortBy === 'overall_desc' ? undefined : 'overall_desc',
            })
          }
          className="flex flex-row items-center justify-between py-3">
          <Text className="text-base">Overall (High to Low)</Text>
          <View
            className={`size-6 items-center justify-center rounded-full border-2 ${
              sortBy === 'overall_desc' ? 'border-primary' : 'border-muted-foreground'
            }`}>
            {sortBy === 'overall_desc' && <View className="size-3.5 rounded-full bg-primary" />}
          </View>
        </Pressable>
        <Pressable
          onPress={() =>
            onChange({
              ...filters,
              sortBy: sortBy === 'overall_asc' ? undefined : 'overall_asc',
            })
          }
          className="flex flex-row items-center justify-between py-3">
          <Text className="text-base">Overall (Low to High)</Text>
          <View
            className={`size-6 items-center justify-center rounded-full border-2 ${
              sortBy === 'overall_asc' ? 'border-primary' : 'border-muted-foreground'
            }`}>
            {sortBy === 'overall_asc' && <View className="size-3.5 rounded-full bg-primary" />}
          </View>
        </Pressable>
      </View>
    </>
  );
}
