import { cn } from '@/lib/utils';
import { View, ViewProps } from 'react-native';
import { Text } from '../ui/text';

type ArchetypeDisplayProps = {
  archetype: string;
  variant?: 'hero' | 'inline';
  size?: 'sm' | 'md' | 'lg';
} & ViewProps;

export function ArchetypeDisplay({
  archetype,
  variant = 'inline',
  size = 'md',
  className,
  ...props
}: ArchetypeDisplayProps) {
  if (!archetype) return null;

  if (variant === 'hero') {
    return <HeroArchetype archetype={archetype} size={size} className={className} {...props} />;
  }

  return <InlineArchetype archetype={archetype} size={size} className={className} {...props} />;
}

type HeroArchetypeProps = {
  archetype: string;
  size?: 'sm' | 'md' | 'lg';
} & ViewProps;

function HeroArchetype({ archetype, size = 'md', className, ...props }: HeroArchetypeProps) {
  const isTwoWay = archetype.startsWith('2-Way');
  const mainName = isTwoWay ? archetype.replace('2-Way ', '') : archetype;

  const sizeStyles = {
    sm: { fontSize: 20, prefixSize: 10 },
    md: { fontSize: 28, prefixSize: 12 },
    lg: { fontSize: 36, prefixSize: 14 },
  };

  const { fontSize, prefixSize } = sizeStyles[size];

  return (
    <View className={cn('flex flex-col', className)} {...props}>
      {isTwoWay && (
        <View className="flex flex-row items-center gap-1.5 mb-0.5">
          <View className="h-px flex-1 max-w-4 bg-muted-foreground/30" />
          <Text
            className="text-muted-foreground uppercase tracking-widest font-semibold"
            style={{ fontSize: prefixSize }}>
            2-Way
          </Text>
          <View className="h-px flex-1 max-w-4 bg-muted-foreground/30" />
        </View>
      )}
      <Text
        className="text-foreground tracking-tight"
        style={{
          fontFamily: 'BebasNeue_400Regular',
          fontSize,
          lineHeight: fontSize * 1.1,
        }}>
        {mainName}
      </Text>
    </View>
  );
}

type InlineArchetypeProps = {
  archetype: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'fill' | 'ghost' | 'muted';
} & ViewProps;

function InlineArchetype({
  archetype,
  size = 'md',
  tone = 'ghost',
  className,
  ...props
}: InlineArchetypeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5',
    md: 'px-2.5 py-1',
    lg: 'px-3 py-1.5',
  };

  const textSizeClasses = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  };

  const toneClasses = {
    fill: 'bg-foreground',
    ghost: 'bg-foreground/5',
    muted: 'bg-muted',
  };

  const textToneClasses = {
    fill: 'text-background',
    ghost: 'text-muted-foreground',
    muted: 'text-muted-foreground',
  };

  return (
    <View
      className={cn(
        'rounded-full flex items-center self-start',
        sizeClasses[size],
        toneClasses[tone],
        className
      )}
      {...props}>
      <Text
        className={cn(
          'font-semibold uppercase tracking-wider',
          textSizeClasses[size],
          textToneClasses[tone]
        )}>
        {archetype}
      </Text>
    </View>
  );
}
