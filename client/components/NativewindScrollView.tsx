import { remapProps } from 'nativewind';
import { ScrollView, ScrollViewProps } from 'react-native';

export function NativewindScrollView({ style, contentContainerStyle, ...props }: ScrollViewProps) {
  return <ScrollView style={style} contentContainerStyle={contentContainerStyle} {...props} />;
}

remapProps(NativewindScrollView, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
});
