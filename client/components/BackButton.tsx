import { useRouter } from 'expo-router';
import { Button } from './ui/button';
import { Icon } from './ui/icon';
import { ArrowLeft } from 'lucide-react-native';

export default function BackButton() {
  const router = useRouter();

  if (!router.canGoBack()) {
    return null;
  }

  return (
    <Button onPress={() => router.back()} variant="secondary" size="icon" className='size-9'>
      <Icon size={20} as={ArrowLeft} />
    </Button>
  );
}
