import { cn } from '@/lib/utils';
import * as AvatarPrimitive from '@rn-primitives/avatar';
import { Image, ImageProps } from 'expo-image';
import { AspectRatio } from './aspect-ratio';

export function Avatar({ className, ...props }: ImageProps) {
  return (
    <AspectRatio
      ratio={1}
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}>
      <Image
        {...props}
        style={{ width: '100%', height: '100%' }}
        className="absolute inset-0 object-cover"
      />
    </AspectRatio>
  );
}
