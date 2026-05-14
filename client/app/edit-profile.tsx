import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import { getUser, patchUserProfile } from '@/lib/endpoints';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { CameraIcon, XIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { toast } from 'sonner-native';

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUserData, refetch: refetchSession } = authClient.useSession();
  const userId = currentUserData?.user.id;

  const { data: user } = useQuery({
    queryFn: async () => getUser(userId!),
    queryKey: ['user', userId],
    enabled: !!userId,
  });

  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setHeight(user.height ?? '');
      setExistingImage(user.image);
    }
  }, [user]);

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: async () => {
      return patchUserProfile({
        name,
        height,
        image: selectedAsset ?? undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      refetchSession();
      toast.success('Profile updated', { position: 'bottom-center' });
      router.back();
    },
    onError: (error) => {
      toast.error(error.message, { position: 'bottom-center' });
    },
  });

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedAsset(result.assets[0]);
    }
  }

  const displayImage = selectedAsset?.uri ?? existingImage;
  const hasChanges =
    selectedAsset !== null || name !== user?.name || height !== (user?.height ?? '');
  const canSave = name.trim().length > 0 && height.trim().length > 0 && hasChanges;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background">
      <View className="flex-1 px-4 py-6">
        <View className="mb-6 flex flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Icon as={XIcon} size={24} className="text-foreground" />
          </Pressable>
          <Text className="text-lg font-semibold">Edit Profile</Text>
          <View className="w-6" />
        </View>

        <View className="flex flex-col items-center gap-6">
          <View className="relative">
            <Pressable onPress={pickImage}>
              <Avatar
                alt="Profile photo"
                className="size-28 bg-secondary"
                source={{ uri: displayImage ?? undefined }}
              />
              <View className="absolute bottom-0 right-0 rounded-full bg-primary p-2">
                <Icon as={CameraIcon} size={16} className="text-primary-foreground" />
              </View>
            </Pressable>
          </View>

          <View className="w-full flex-col gap-4">
            <View className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View className="flex flex-col gap-2">
              <Label>Height</Label>
              <Input value={height} onChangeText={setHeight} placeholder="e.g. 6'2&quot;" />
            </View>
          </View>
        </View>

        <View className="mt-auto pt-6">
          <Button
            size="lg"
            disabled={isPending || !canSave}
            onPress={() => saveProfile()}
            className="w-full">
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text>Save Changes</Text>
            )}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
