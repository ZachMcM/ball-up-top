import { cn } from '@/lib/utils';
import { MoveDown, MoveUp } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';
import { Icon } from '../ui/icon';
import { Text } from '../ui/text';

type DeltaIndicatorProps = {
  value: number | null;
  size?: 'sm' | 'md' | 'lg' | "xl";
} & ViewProps;

export function DeltaIndicator({
  value,
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
  const absValue = Math.abs(value);

  const colorClass = isPositive ? 'text-emerald-500' : 'text-destructive';

  const sizeClasses = {
    sm: {
      text: 'text-[11px]',
      icon: 10,
    },
    md: {
      text: 'text-sm',
      icon: 12,
    },
    lg: {
      text: 'text-base',
      icon: 18,
    },
    xl: {
      text: "text-3xl",
      icon: 24
    }
  };

  return (
    <View className={cn('gap-0.25 flex flex-row items-center', className)} {...props}>
      <Icon
        as={isPositive ? MoveUp : MoveDown}
        className={cn(colorClass)}
        size={sizeClasses[size].icon}
      />
      <Text style={{
        fontFamily: "BebasNeue_400Regular"
      }} className={cn('font-bold tabular-nums', colorClass, sizeClasses[size].text)}>
        {absValue}
      </Text>
    </View>
  );
}
