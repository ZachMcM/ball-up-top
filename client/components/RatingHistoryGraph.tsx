import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { timeAgo } from '@/lib/utils';
import { RatingHistoryPoint } from '@/types/user';
import { useColorScheme } from 'nativewind';
import { useMemo } from 'react';
import { LineChart } from 'react-native-gifted-charts';

export function RatingHistoryGraph({ points }: { points: RatingHistoryPoint[] }) {
  const { colorScheme } = useColorScheme();

  const initialScrollIndex = useMemo(() => {
    if (points.length === 0) return 0;
    let maxIndex = 0;
    points.forEach((point, i) => {
      if (points[0].overall < point.overall) {
        maxIndex = i;
      }
    });
    return maxIndex;
  }, [points]);

  if (points.length === 0) {
    return <Text className="text-center text-xs font-medium">No ratings data yet.</Text>;
  }

  return (
    <LineChart
      isAnimated
      hideYAxisText
      height={56}
      thickness={2}
      color={THEME[colorScheme!].primary}
      dataPointsColor={THEME[colorScheme!].primary}
      dataPointsRadius={2.5}
      hideRules
      xAxisThickness={0}
      yAxisThickness={0}
      spacing={96}
      scrollToIndex={initialScrollIndex}
      dataPointLabelShiftY={-14}
      dataPointLabelShiftX={8}
      yAxisOffset={45}
      xAxisLabelTextStyle={{
        color: THEME[colorScheme!].mutedForeground,
        fontWeight: 500,
        width: 96,
        marginLeft: 32,
        fontSize: 12,
      }}
      maxValue={99}
      data={points.map((entry) => ({
        value: entry.overall,
        label: timeAgo(entry.createdAt),
        dataPointLabelComponent: () => (
          <Text className="text-xs font-medium text-muted-foreground">{entry.overall}</Text>
        ),
      }))}
    />
  );
}
