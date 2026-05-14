import { cn } from '@/lib/utils';
import { MoveDown, MoveUp } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';
import { Icon } from '../ui/icon';
import { Text } from '../ui/text';

type DeltaIndicatorProps = {
  value: number | null;
  type?: 'rank' | 'ovr';
  size?: 'sm' | 'md' | 'lg';
} & ViewProps;

export function DeltaIndicator({
  value,
  type = 'rank',
  size = 'md',
  className,
  ...props
}: DeltaIndicatorProps) {
  if (value === null || value === 0) {
    return (
      <View className={cn('flex flex-row items-center', className)} {...props}>
        <Text className="text-muted-foreground">—</Text>
      </View>
    );
  }

  const isPositive = value > 0;
  const arrow = isPositive ? '↑' : '↓';
  const absValue = Math.abs(value);

  const colorClass = isPositive ? 'text-green-400' : 'text-red-400';

  const sizeClasses = {
    sm: {
      text: 'text-[11px]',
      icon: 10,
    },
    md: {
      text: 'text-xs',
      icon: 12,
    },
    lg: {
      text: 'text-sm',
      icon: 14,
    },
  };

  return (
    <View className={cn('gap-0.25 flex flex-row items-center', className)} {...props}>
      <Icon
        as={isPositive ? MoveUp : MoveDown}
        className={cn(colorClass)}
        size={sizeClasses[size].icon}
      />
      <Text className={cn('font-bold tabular-nums', colorClass, sizeClasses[size].text)}>
        {absValue}
      </Text>
    </View>
  );
}
