import { NativewindScrollView } from '@/components/NativewindScrollView';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import {
  getColleges,
  patchUserImage,
  patchUserName,
  patchUserPrimaryCollege,
} from '@/lib/endpoints';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { CheckCircleIcon, ChevronRightIcon } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { toast } from 'sonner-native';

export default function EditProfilePage() {
  const { data: session, refetch: refetchAuthClientSession } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [nameValue, setNameValue] = useState(user?.name ?? '');
  const [selectedAsset, setSelectedAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [collegeSearch, setCollegeSearch] = useState('');

  const { data: colleges, isPending: collegesPending } = useQuery({
    queryKey: ['colleges'],
    queryFn: getColleges,
  });

  const currentCollegeId = (user as any)?.primaryCollegeId as number | undefined;

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedAsset(result.assets[0]);
    }
  }

  const { mutate: saveIdentity, isPending: isSavingIdentity } = useMutation({
    mutationFn: async () => {
      const ops: Promise<any>[] = [];
      if (nameValue.trim() && nameValue.trim() !== user?.name) {
        ops.push(patchUserName(nameValue.trim()));
      }
      if (selectedAsset) {
        ops.push(patchUserImage(selectedAsset));
      }
      if (ops.length === 0) return;
      await Promise.all(ops);
    },
    onSuccess: () => {
      refetchAuthClientSession();
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
      setSelectedAsset(null);
      toast.success('Profile updated!', { position: 'bottom-center' });
    },
    onError: (error) => {
      toast.error(error.message, { position: 'bottom-center' });
    },
  });

  const { mutate: saveCollege, isPending: isSavingCollege } = useMutation({
    mutationFn: async (collegeId: number) => {
      await patchUserPrimaryCollege(collegeId);
      return collegeId;
    },
    onSuccess: (collegeId) => {
      refetchAuthClientSession();
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard', collegeId] });
      toast.success('Primary court updated!', { position: 'bottom-center' });
    },
    onError: (error) => {
      toast.error(error.message, { position: 'bottom-center' });
    },
  });

  const avatarUri = selectedAsset?.uri ?? user?.image ?? undefined;
  const identityChanged =
    (nameValue.trim() && nameValue.trim() !== user?.name) || !!selectedAsset;

  const filteredColleges = colleges?.filter((c) =>
    c.name.toLocaleLowerCase().includes(collegeSearch.toLocaleLowerCase())
  );

  return (
    <NativewindScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="flex flex-col gap-6 px-4 pt-6 pb-12">

      {/* Identity */}
      <View className="flex flex-col gap-4">
        <Text className="text-sm font-semibold text-muted-foreground">Identity</Text>
        <View className="flex flex-col items-center gap-2">
          <Pressable onPress={pickImage} className="active:opacity-70">
            <Avatar
              alt={user?.name ?? 'Profile'}
              className="size-24 bg-secondary"
              source={{ uri: avatarUri }}
            />
          </Pressable>
          <Pressable onPress={pickImage} className="active:opacity-70">
            <Text className="text-sm font-medium text-primary">Edit Photo</Text>
          </Pressable>
        </View>
        <View className="flex flex-col gap-1.5">
          <Text className="text-sm font-medium">Display Name</Text>
          <Input
            value={nameValue}
            onChangeText={setNameValue}
            placeholder="Your name"
            returnKeyType="done"
          />
        </View>
        <Button
          onPress={() => saveIdentity()}
          disabled={isSavingIdentity || !identityChanged}
          size="lg">
          <Text>Save Changes</Text>
          {isSavingIdentity && (
            <ActivityIndicator size="small" className="text-primary-foreground" />
          )}
        </Button>
      </View>

      {/* Primary Court */}
      <View className="flex flex-col gap-4">
        <Text className="text-sm font-semibold text-muted-foreground">Primary Court</Text>
        <Input
          placeholder="Search for your college..."
          value={collegeSearch}
          onChangeText={setCollegeSearch}
          editable={!collegesPending}
        />
        {isSavingCollege && (
          <View className="items-center">
            <ActivityIndicator size="small" />
          </View>
        )}
        <View className="flex flex-col gap-2">
          {filteredColleges?.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => saveCollege(c.id)}
              className={cn(
                'flex flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 active:opacity-70',
                currentCollegeId === c.id && 'border-primary'
              )}>
              <Text className="text-sm font-medium">
                {c.name} ({c.abbreviation})
              </Text>
              {currentCollegeId === c.id && (
                <Icon as={CheckCircleIcon} size={14} className="text-primary" />
              )}
            </Pressable>
          ))}
        </View>
      </View>

      {/* Email */}
      <View className="flex flex-col gap-4">
        <Text className="text-sm font-semibold text-muted-foreground">Email</Text>
        <Pressable
          onPress={() => router.push('/(tabs)/(profile)/edit-email')}
          className="flex flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 active:opacity-70">
          <View className="flex flex-col gap-0.5">
            <Text className="text-sm font-medium">{user?.email}</Text>
            <Text className="text-xs text-muted-foreground">Tap to change email</Text>
          </View>
          <Icon as={ChevronRightIcon} size={16} className="text-muted-foreground" />
        </Pressable>
      </View>
    </NativewindScrollView>
  );
}
