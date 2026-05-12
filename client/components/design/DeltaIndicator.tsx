import { cn } from '@/lib/utils';
import { View, ViewProps } from 'react-native';
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
    sm: 'text-[11px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <View className={cn('flex flex-row items-center', className)} {...props}>
      <Text className={cn('font-bold tabular-nums', colorClass, sizeClasses[size])}>
        {arrow}
        {absValue}
      </Text>
    </View>
  );
}
