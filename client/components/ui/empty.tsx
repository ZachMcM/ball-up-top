import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

function Empty({ className, ...props }: ViewProps & React.RefAttributes<View>) {
  return (
    <View
      className={cn('flex flex-col items-center justify-center gap-6 p-6 rounded-xl', className)}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: ViewProps & React.RefAttributes<View>) {
  return (
    <View className={cn('flex flex-col items-center justify-center gap-3', className)} {...props} />
  );
}

const emptyMediaVariants = cva('flex items-center justify-center', {
  variants: {
    variant: {
      default: 'h-16 w-16',
      icon: 'h-9 w-9 rounded-full bg-muted p-3',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type EmptyMediaVariantProps = VariantProps<typeof emptyMediaVariants>;

function EmptyMedia({
  className,
  variant,
  ...props
}: ViewProps & EmptyMediaVariantProps & React.RefAttributes<View>) {
  return <View className={cn(emptyMediaVariants({ variant }), className)} {...props} />;
}

function EmptyTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  return (
    <Text
      role="heading"
      aria-level={3}
      className={cn('text-center text-lg font-semibold', className)}
      {...props}
    />
  );
}

function EmptyDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  return (
    <Text className={cn('text-muted-foreground text-center text-sm', className)} {...props} />
  );
}

function EmptyContent({ className, ...props }: ViewProps & React.RefAttributes<View>) {
  return <View className={cn('flex flex-col items-center gap-2', className)} {...props} />;
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle };
