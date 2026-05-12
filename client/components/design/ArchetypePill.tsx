import { cn } from '@/lib/utils';
import { View, ViewProps } from 'react-native';
import { Text } from '../ui/text';

type ArchetypePillProps = {
  archetype: string;
  tone?: 'fill' | 'outline' | 'ghost' | 'dim';
  size?: 'sm' | 'md';
} & ViewProps;

export function ArchetypePill({
  archetype,
  tone = 'fill',
  size = 'md',
  className,
  ...props
}: ArchetypePillProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5',
    md: 'px-3 py-1',
  };

  const toneClasses = {
    fill: 'bg-foreground',
    outline: 'border border-border bg-transparent',
    ghost: 'bg-foreground/5',
    dim: 'bg-muted',
  };

  const textToneClasses = {
    fill: 'text-background',
    outline: 'text-foreground',
    ghost: 'text-muted-foreground',
    dim: 'text-foreground',
  };

  const textSizeClasses = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
  };

  return (
    <View
      className={cn('rounded-full flex items-center', sizeClasses[size], toneClasses[tone], className)}
      {...props}>
      <Text
        className={cn(
          'font-bold uppercase tracking-widest',
          textSizeClasses[size],
          textToneClasses[tone]
        )}>
        {archetype}
      </Text>
    </View>
  );
}
