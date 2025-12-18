import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import { LineChart, LineChartPropsType } from 'react-native-gifted-charts';
import { Text } from './ui/text';
import { View } from 'react-native';
import { NativewindScrollView } from './NativewindScrollView';

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

  const getBusiestHour = () => {
    let maxIndex = 0;
    points.forEach(({ avgSessions }, index) => {
      if (points[maxIndex].avgSessions < avgSessions) {
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

  const doesDataExist = () => points.find((p) => p.avgSessions > 0) !== undefined;

  return doesDataExist() ? (
    <NativewindScrollView horizontal showsHorizontalScrollIndicator={false}>
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
        data={points.map((entry, i) => ({
          value:
            process.env.NODE_ENV == 'development'
              ? i == 0
                ? 0
                : Math.random() * 50
              : entry.avgSessions,
          label: getLabel(entry.hour),
        }))}
        {...props}
      />
    </NativewindScrollView>
  ) : (
    <Text className="text-center text-xs font-medium">No data yet.</Text>
  );
}
