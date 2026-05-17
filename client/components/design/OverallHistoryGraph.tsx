import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { timeAgo } from '@/lib/utils';
import { useColorScheme } from 'nativewind';
import { useMemo } from 'react';
import { LineChart } from 'react-native-gifted-charts';

export type OverallHistoryPoint = {
  createdAt: Date;
  overall: number;
};

export function OverallHistoryGraph({ points }: { points: OverallHistoryPoint[] }) {
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

  const areaStartOpacity = colorScheme === 'dark' ? 0.2 : 0.15;

  return (
    <LineChart
      curved
      scrollToEnd
      isAnimated
      areaChart
      hideYAxisText
      height={72}
      thickness={1.5}
      color={THEME[colorScheme!].primary}
      startFillColor={THEME[colorScheme!].primary}
      endFillColor={THEME[colorScheme!].primary}
      startOpacity={areaStartOpacity}
      endOpacity={0}
      dataPointsColor={THEME[colorScheme!].primary}
      dataPointsRadius={3}
      hideRules
      yAxisColor={THEME[colorScheme!].primary}
      xAxisColor={THEME[colorScheme!].primary}
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
        marginLeft: 8,
        fontSize: 12,
      }}
      maxValue={99}
      data={points.map((entry) => ({
        value: entry.overall,
        label: new Date(entry.createdAt).toLocaleDateString("en-us", {
          month: "2-digit",
          day: "2-digit",
          year: "2-digit"
        }),
        dataPointLabelComponent: () => (
          <Text className="text-lg leading-5 font-bebas font-medium">{entry.overall}</Text>
        ),
      }))}
    />
  );
}
