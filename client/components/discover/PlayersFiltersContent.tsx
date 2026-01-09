import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { CheckIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

interface PlayersFiltersContentProps {
  filters: {
    archetypes?: string[];
    minHeight?: number;
    maxHeight?: number;
    minOverall?: number;
    sortBy?: 'most_active' | 'overall_desc' | 'overall_asc';
  };
  onChange: (filters: PlayersFiltersContentProps['filters']) => void;
}

const ARCHETYPES = [
  'Unranked',
  'Two-Way Star',
  'Floor General',
  'Defensive Anchor',
  '3-Level Scorer',
  'Lockdown Defender',
  'Stretch Big',
  'Rim Protector',
  'Sharpshooter',
  'Slasher',
  'Facilitator',
  'Paint Beast',
];

export function PlayersFiltersContent({ filters, onChange }: PlayersFiltersContentProps) {
  const { archetypes = [], minHeight, maxHeight, minOverall, sortBy } = filters;

  const toggleArchetype = (archetype: string) => {
    const newArchetypes = archetypes.includes(archetype)
      ? archetypes.filter((a) => a !== archetype)
      : [...archetypes, archetype];

    onChange({
      ...filters,
      archetypes: newArchetypes.length > 0 ? newArchetypes : undefined,
    });
  };

  return (
    <>
      <View className="flex flex-col gap-2 border-b border-border px-4 py-5">
        <Text className="text-lg font-bold">Archetypes</Text>
        {ARCHETYPES.map((archetype) => (
          <Pressable
            key={archetype}
            onPress={() => toggleArchetype(archetype)}
            className="flex flex-row items-center justify-between py-3">
            <Text className="text-base">{archetype}</Text>
            <View
              className={`size-6 items-center justify-center rounded-md border-2 ${
                archetypes.includes(archetype)
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground'
              }`}>
              {archetypes.includes(archetype) && (
                <Icon as={CheckIcon} size={16} className="text-primary-foreground" />
              )}
            </View>
          </Pressable>
        ))}
      </View>
      <View className="flex flex-col gap-4 border-b border-border px-4 py-5">
        <Text className="text-lg font-bold">Height Range (inches)</Text>
        <View className="flex flex-row gap-2">
          <View className="flex-1">
            <Text className="mb-2 text-sm text-muted-foreground">Min</Text>
            <Input
              keyboardType="numeric"
              placeholder="60"
              value={minHeight?.toString() ?? ''}
              onChangeText={(text) =>
                onChange({
                  ...filters,
                  minHeight: text ? parseInt(text, 10) : undefined,
                })
              }
            />
          </View>
          <View className="flex-1">
            <Text className="mb-2 text-sm text-muted-foreground">Max</Text>
            <Input
              keyboardType="numeric"
              placeholder="90"
              value={maxHeight?.toString() ?? ''}
              onChangeText={(text) =>
                onChange({
                  ...filters,
                  maxHeight: text ? parseInt(text, 10) : undefined,
                })
              }
            />
          </View>
        </View>
      </View>
      <View className="flex flex-col gap-4 border-b border-border px-4 py-5">
        <Text className="text-lg font-bold">Minimum Overall</Text>
        <Input
          keyboardType="numeric"
          placeholder="60"
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
