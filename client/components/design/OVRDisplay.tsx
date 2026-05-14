import { cn } from '@/lib/utils';
import { Text } from '../ui/text';

type OVRDisplayProps = {
  className?: string;
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const SIZE_CLASSES = {
  sm: 'text-[26px] leading-[29px]',
  md: 'text-[32px] leading-[35px]',
  lg: 'text-[132px] leading-[135px]',
  xl: 'text-[148px] leading-[150px]',
};

export function OVRDisplay({ value, size = 'lg', className }: OVRDisplayProps) {
  return (
    <Text
      className={cn(
        'font-bebas tabular-nums tracking-tighter',
        SIZE_CLASSES[size],
        className
      )}>
      {value}
    </Text>
  );
}
