import { useRouter } from 'expo-router';
import { useNavigationState } from '@react-navigation/native';
import { Button } from './ui/button';
import { Icon } from './ui/icon';
import { ArrowLeft } from 'lucide-react-native';

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
    <Button onPress={() => router.back()} variant="secondary" size="icon" className='size-8'>
      <Icon size={18} as={ArrowLeft} />
    </Button>
  );
}
