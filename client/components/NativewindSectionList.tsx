import { remapProps } from 'nativewind';
import { SectionList, SectionListProps } from 'react-native';

export function NativewindSectionList<T, S>({
  style,
  contentContainerStyle,
  ...props
}: SectionListProps<T, S>) {
  return <SectionList<T, S> style={style} contentContainerStyle={contentContainerStyle} {...props} />;
}

remapProps(NativewindSectionList, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
});
