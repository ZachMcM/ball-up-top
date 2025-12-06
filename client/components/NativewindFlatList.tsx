import { remapProps } from 'nativewind';
import { FlatList, FlatListProps } from 'react-native';

export function NativewindFlatList<T>({ style, contentContainerStyle, ...props }: FlatListProps<T>) {
  return <FlatList<T> style={style} contentContainerStyle={contentContainerStyle} {...props} />;
}

remapProps(NativewindFlatList, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
});
