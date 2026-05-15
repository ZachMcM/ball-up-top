import { useNavigationState } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { Icon } from './ui/icon';

export default function BackButton() {
  const router = useRouter();

  // Check if we're at the root of the current navigation stack
  const isAtRoot = useNavigationState((state) => {
    if (!state) return true;
    return state.index === 0;
  });

  // Don't show back button if we can't go back or if we're at the root of a tab
  if (!router.canGoBack() || isAtRoot) {
    return null;
  }

  return (
    <Pressable className='active:opacity-70' onPress={() => router.back()}>
      <Icon size={22} as={ChevronLeft} />
    </Pressable>
  );
}
