import { cn } from '@/lib/utils';
import { View, ViewProps } from 'react-native';
import { Progress } from '../ui/progress';
import { Text } from '../ui/text';

type StatBarProps = {
  label: string;
  value: number;
  max?: number;
  accent?: string;
} & ViewProps;

export function StatBar({ label, value, max = 99, accent, className, ...props }: StatBarProps) {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <View className={cn('flex flex-row items-center gap-3', className)} {...props}>
      <Text className="w-24 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </Text>
      <View className="flex-1">
        <Progress value={percentage} className="h-1.5" indicatorClassName={accent} />
      </View>
      <Text className="w-8 text-right font-mono text-sm font-semibold tabular-nums">{value}</Text>
    </View>
  );
}
