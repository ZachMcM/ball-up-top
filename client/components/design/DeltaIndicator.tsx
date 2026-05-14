import { cn } from '@/lib/utils';
import { MoveDown, MoveUp } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';
import { Icon } from '../ui/icon';
import { Text } from '../ui/text';

type DeltaIndicatorProps = {
  value: number | null;
  size?: 'sm' | 'lg';
} & ViewProps;

export function DeltaIndicator({
  value,
  size = 'sm',
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
  const absValue = Math.abs(value);

  const colorClass = isPositive ? 'text-emerald-500' : 'text-destructive';

  const sizeClasses = {
    sm: {
      text: 'text-xl',
      icon: 16,
    },
    lg: {
      text: "text-3xl",
      icon: 20
    }
  };

  return (
    <View className={cn('gap-0.25 flex flex-row items-center', className)} {...props}>
      <Icon
        as={isPositive ? MoveUp : MoveDown}
        className={cn(colorClass)}
        size={sizeClasses[size].icon}
      />
      <Text className={cn('font-bebas font-bold tabular-nums', colorClass, sizeClasses[size].text)}>
        {absValue}
      </Text>
    </View>
  );
}
