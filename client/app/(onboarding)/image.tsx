import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import { patchUserImage } from '@/lib/endpoints';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { toast } from 'sonner-native';

export default function ImagePage() {
  const { refetch: refetchAuthClientSession } = authClient.useSession();
  const [selectedAsset, setSelectedAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const { mutate: saveImage, isPending } = useMutation({
    mutationFn: async () => {
      await patchUserImage(selectedAsset!, { onboardingStep: 'primaryCollege' });
    },
    onSuccess: () => {
      refetchAuthClientSession();
      toast.success('Image saved!', { position: 'bottom-center' });
    },
    onError: (error) => {
      console.log('Error', error);
      toast.error(error.message, { position: 'bottom-center' });
    },
  });

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedAsset(result.assets[0]);
    }
  }

  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <View className="flex w-full flex-col items-center gap-4 p-8">
        <Text className="text-xl font-bold">Add an image of yourself.</Text>
        <View className="flex items-center gap-4">
          <Pressable onPress={pickImage}>
            <Avatar
              alt="User Image"
              className="size-32"
              source={{ uri: selectedAsset?.uri ?? undefined }}
            />
          </Pressable>
          <Button variant="outline" onPress={pickImage}>
            <Text>{selectedAsset?.uri ? 'Change Image' : 'Select Image'}</Text>
          </Button>
        </View>
        <Text className="text-center text-xs font-medium text-muted-foreground">
          This help others identify you. You can change this later.
        </Text>
        <View className="flex w-full flex-row items-center gap-2">
          {router.canGoBack() && (
            <Button size="lg" className="flex-1" onPress={() => router.back()} variant="outline">
              <Icon as={ArrowLeftIcon} size={18} />
              <Text>Back</Text>
            </Button>
          )}
          <Button
            className="flex-1"
            size="lg"
            disabled={isPending || !selectedAsset?.uri || !selectedAsset}
            onPress={() => saveImage()}>
            <Text>Continue</Text>
            {isPending && <ActivityIndicator />}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
