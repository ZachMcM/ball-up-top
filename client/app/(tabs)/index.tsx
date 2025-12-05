import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react-native';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

export default function Courts() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <View className="flex w-full flex-col gap-6 p-6">
        <View className="flex w-full flex-row items-center gap-2">
          <Input className="flex-1" placeholder="Search for a court..." />
          <Button size="icon">
            <Icon size={18} className="text-primary-foreground" as={PlusCircle} />
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
