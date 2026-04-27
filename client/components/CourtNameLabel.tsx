import { cn } from '@/lib/utils';
import { View, ViewProps } from 'react-native';
import { Text } from './ui/text';

type Size = 'sm' | 'md' | 'lg';

const collegeSizeClass: Record<Size, string> = {
  sm: 'text-[10px] leading-tight',
  md: 'text-xs leading-tight',
  lg: 'text-sm leading-tight',
};

const nameSizeClass: Record<Size, string> = {
  sm: 'text-sm font-semibold leading-tight',
  md: 'text-base font-semibold leading-tight',
  lg: 'text-2xl font-bold leading-tight',
};

export function CourtNameLabel({
  collegeName,
  collegeColor,
  courtName,
  size = 'md',
  className,
  nameClassName,
  ...props
}: {
  collegeName: string;
  collegeColor: string;
  courtName: string;
  size?: Size;
  nameClassName?: string;
} & ViewProps) {
  return (
    <View className={cn('flex flex-col gap-0.5', className)} {...props}>
      <Text
        className={cn('font-bold uppercase tracking-wide', collegeSizeClass[size])}
        style={{ color: collegeColor }}
        numberOfLines={1}>
        {collegeName}
      </Text>
      <Text className={cn(nameSizeClass[size], nameClassName)} numberOfLines={1}>
        {courtName}
      </Text>
    </View>
  );
}
