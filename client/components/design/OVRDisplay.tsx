import { cn } from '@/lib/utils';
import { TextStyle } from 'react-native';
import { Text } from '../ui/text';

type OVRDisplayProps = {
  className?: string;
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  style?: TextStyle;
};

const SIZES = {
  sm: 26,
  md: 32,
  lg: 132,
  xl: 148,
};

export function OVRDisplay({ value, size = 'lg', style, className }: OVRDisplayProps) {
  const fontSize = SIZES[size];

  return (
    <Text
      className={cn('tracking-tighter', className)}
      style={[
        {
          lineHeight: fontSize * 1.1,
          fontFamily: 'BebasNeue_400Regular',
          fontSize,
          fontVariant: ['tabular-nums'],
        },
        style,
      ]}>
      {value}
    </Text>
  );
}
