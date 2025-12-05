import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { patchUserImage } from '@/lib/endpoints';
import { toast } from 'sonner-native';

export default function ImageScreen() {
  const [selectedImageUri, setselectedImageUri] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const { mutate: saveImage, isPending } = useMutation({
    mutationFn: async () => {
      await patchUserImage(selectedAsset!);
      await authClient.updateUser({
        onboardingStep: 'complete',
      });
    },
    onSuccess: () => {
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
      setselectedImageUri(result.assets[0].uri);
      setSelectedAsset(result.assets[0]);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <View className="flex w-full flex-col items-center gap-4 p-8">
        <Text className="text-xl font-bold">Add an image of yourself.</Text>
        <View className="flex items-center gap-4">
          <Avatar alt="User Image" className="size-32">
            <AvatarImage source={{ uri: selectedImageUri ?? undefined }} />
            <AvatarFallback className="bg-muted" />
          </Avatar>
          <Button variant="outline" onPress={pickImage}>
            <Text>{selectedImageUri ? 'Change Image' : 'Select Image'}</Text>
          </Button>
        </View>
        <Text className="text-center text-xs font-medium text-muted-foreground">
          This help others identify you. You can change this later.
        </Text>
        <Button
          className="w-full"
          size="lg"
          disabled={isPending || !selectedImageUri || !selectedAsset}
          onPress={() => saveImage()}>
          <Text>Continue</Text>
          {isPending && <ActivityIndicator />}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
