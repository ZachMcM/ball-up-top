import { cn } from '@/lib/utils';
import { View, ViewProps } from 'react-native';
import { Text } from '../ui/text';

type ArchetypeDisplayProps = {
  archetype: string;
  variant?: 'hero' | 'inline';
  tone?: 'fill' | 'muted';
  size?: 'sm' | 'md' | 'lg' | 'xl';
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

  return (
    <InlineArchetype
      archetype={archetype}
      size={size !== 'xl' ? size : 'lg'}
      className={className}
      {...props}
    />
  );
}

type HeroArchetypeProps = {
  archetype: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
} & ViewProps;

const HERO_SIZE_CLASSES = {
  sm: 'text-[20px] leading-[22px]',
  md: 'text-[28px] leading-[31px]',
  lg: 'text-[36px] leading-[40px]',
  xl: 'text-[44px] leading-[48px]',
};

function HeroArchetype({ archetype, size = 'md' }: HeroArchetypeProps) {
  return (
    <Text className={cn('font-bebas tracking-tighter text-foreground', HERO_SIZE_CLASSES[size])}>
      {archetype}
    </Text>
  );
}

type InlineArchetypeProps = {
  archetype: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'fill' | 'muted';
} & ViewProps;

function InlineArchetype({
  archetype,
  size = 'md',
  tone = 'muted',
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
    muted: 'bg-muted/70 border border-border',
  };

  const textToneClasses = {
    fill: 'text-background',
    muted: 'text-foreground',
  };

  return (
    <View
      className={cn(
        'flex items-center self-start rounded-full',
        sizeClasses[size],
        toneClasses[tone],
        className
      )}
      {...props}>
      <Text
        className={cn(
          'font-bold uppercase tracking-wider',
          textSizeClasses[size],
          textToneClasses[tone]
        )}>
        {archetype}
      </Text>
    </View>
  );
}
