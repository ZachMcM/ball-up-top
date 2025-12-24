import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import { useMemo, useRef } from 'react';
import { LineChart, LineChartPropsType } from 'react-native-gifted-charts';
import { NativewindScrollView } from './NativewindScrollView';
import { Text } from './ui/text';

// Normalize UTC hours from server to local timezone
const normalizeToLocalTimezone = (points: { hour: number; avgSessions: number }[]) => {
  const offsetHours = -new Date().getTimezoneOffset() / 60;

  return points
    .map(({ hour, avgSessions }) => ({
      hour: (hour + offsetHours + 24) % 24,
      avgSessions,
    }))
    .sort((a, b) => a.hour - b.hour);
};

export default function ActivityGraph({
  points,
  ...props
}: {
  points: {
    hour: number;
    avgSessions: number;
  }[];
} & LineChartPropsType) {
  const { colorScheme } = useColorScheme();
  const localPoints = useMemo(() => normalizeToLocalTimezone(points), [points]);

  const getBusiestHour = () => {
    let maxIndex = 0;
    localPoints.forEach(({ avgSessions }, index) => {
      if (localPoints[maxIndex].avgSessions < avgSessions) {
        maxIndex = index;
      }
    });

    return maxIndex;
  };

  const getLabel = (hour: number) => {
    if (hour % 2 !== 0) {
      return undefined;
    }

    return hour === 12 ? '12pm' : hour === 0 ? '12am' : hour > 12 ? `${hour - 12}pm` : `${hour}am`;
  };

  const doesDataExist = () => localPoints.find((p) => p.avgSessions > 0) !== undefined;

  return doesDataExist() ? (
    <LineChart
      isAnimated
      hideYAxisText
      height={42}
      thickness={2}
      color={THEME[colorScheme!].primary}
      dataPointsColor={THEME[colorScheme!].primary}
      dataPointsRadius={2}
      hideRules
      scrollToIndex={getBusiestHour()}
      xAxisThickness={0}
      yAxisThickness={0}
      xAxisLabelTextStyle={{
        color: THEME[colorScheme!].mutedForeground,
        fontWeight: 500,
        width: 96,
      }}
      data={localPoints.map((entry) => ({
        value: entry.avgSessions,
        label: getLabel(entry.hour),
      }))}
      {...props}
    />
  ) : (
    <Text className="text-center text-xs font-medium">No data yet.</Text>
  );
}
