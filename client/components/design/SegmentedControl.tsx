import { cn } from '@/lib/utils';
import { Pressable, View, ViewProps } from 'react-native';
import { Text } from '../ui/text';

type SegmentedControlProps = {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
} & ViewProps;

export function SegmentedControl({
  options,
  selected,
  onChange,
  className,
  ...props
}: SegmentedControlProps) {
  return (
    <View
      className={cn(
        'flex flex-row items-center justify-between rounded-full bg-muted/30 p-1',
        className
      )}
      {...props}>
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            className={cn(
              'flex-1 rounded-full px-4 py-2',
              isSelected && 'bg-secondary dark:bg-secondary'
            )}>
            <Text
              className={cn(
                'text-center text-sm font-semibold',
                isSelected ? 'text-foreground' : 'text-muted-foreground'
              )}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
