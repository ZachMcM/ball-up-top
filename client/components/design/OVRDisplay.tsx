import { Text, TextStyle } from 'react-native';

type OVRDisplayProps = {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  style?: TextStyle;
};

const SIZES = {
  sm: 22,
  md: 32,
  lg: 132,
  xl: 148,
};

export function OVRDisplay({ value, size = 'lg', color, style }: OVRDisplayProps) {
  const fontSize = SIZES[size];

  return (
    <Text
      style={[
        {
          lineHeight: fontSize * 1.1,
          fontFamily: 'BebasNeue_400Regular',
          fontSize,
          color: color ?? '#fafafa',
          fontVariant: ['tabular-nums'],
        },
        style,
      ]}>
      {value}
    </Text>
  );
}
