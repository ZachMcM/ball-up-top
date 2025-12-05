import { ActivityIndicator, View } from 'react-native';

export default function Pending() {
  return (
    <View className="flex flex-1 items-center justify-center">
      <ActivityIndicator />
    </View>
  );
}
