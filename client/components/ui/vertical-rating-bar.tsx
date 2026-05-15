import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { View } from 'react-native';

const TOTAL_SEGMENTS = 22;

interface VerticalRatingBarProps {
  value: number;
  label: string;
  className?: string;
  color?: string;
}

export function VerticalRatingBar({ value, label, className, color }: VerticalRatingBarProps) {
  // Calculate how many segments should be filled (each segment = 4 points)
  const filledSegments = Math.round(value / 4);

  // Generate segments from top (25) to bottom (1)
  const segments = Array.from({ length: TOTAL_SEGMENTS }, (_, i) => {
    const segmentNumber = TOTAL_SEGMENTS - i; // 25, 24, 23, ... 1
    const isFilled = segmentNumber <= filledSegments;
    return { segmentNumber, isFilled };
  });

  return (
    <View className={cn('flex flex-1 flex-col items-center gap-3', className)}>
      <Text className="text-2xl font-bold font-bebas ">{value}</Text>
      <View className="flex w-9 flex-col gap-0.5">
        {segments.map(({ segmentNumber, isFilled }) => (
          <View
            key={segmentNumber}
            className={cn(
              'h-1.5 w-full rounded-sm',
              !isFilled ? 'bg-primary/10' : (color ?? 'bg-primary')
            )}
          />
        ))}
      </View>
      <Text className="text-xs font-medium text-muted-foreground">{label}</Text>
    </View>
  );
}
