import { remapProps } from 'nativewind';
import { Image, ImageProps } from 'expo-image';

export function NativewindImage({ style, ...props }: ImageProps) {
  return <Image style={style} {...props} />;
}

remapProps(NativewindImage, {
  className: 'style',
});
