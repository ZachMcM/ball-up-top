import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

function Empty({ className, ...props }: ViewProps & React.RefAttributes<View>) {
  return (
    <View
      className={cn('flex flex-col items-center justify-center gap-3 px-6 py-12', className)}
      {...props}
    />
  );
}

function EmptyNumeral({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  return (
    <Text
      className={cn(
        'font-bebas text-[88px] leading-[90px] tracking-tighter tabular-nums text-muted-foreground/30',
        className
      )}
      {...props}
    />
  );
}

function EmptyTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  return (
    <Text
      role="heading"
      aria-level={3}
      className={cn('text-center text-lg font-semibold text-foreground', className)}
      {...props}
    />
  );
}

function EmptyDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  return (
    <Text
      className={cn('max-w-[280px] text-center text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function EmptyAction({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button className={cn('mt-3', className)} {...props}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Button>
  );
}

export { Empty, EmptyAction, EmptyDescription, EmptyNumeral, EmptyTitle };
