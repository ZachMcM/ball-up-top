import { NativewindScrollView } from '@/components/NativewindScrollView';
import { CollegeCombobox } from '@/components/design/CollegeCombobox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import {
  getColleges,
  patchUserImage,
  patchUserName,
  patchUserPrimaryCollege,
} from '@/lib/endpoints';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
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
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

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

  const { mutate: signOut, isPending: isSigningOut } = useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: () => {
      router.replace('/auth');
    },
    onError: (error) => {
      toast.error(error.message, { position: 'bottom-center' });
    },
  });

  const avatarUri = selectedAsset?.uri ?? user?.image ?? undefined;
  const identityChanged = (nameValue.trim() && nameValue.trim() !== user?.name) || !!selectedAsset;

  return (
    <NativewindScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="flex flex-col gap-6 px-4 pt-6 pb-12">
      {/* Identity */}
      <View className="flex flex-col gap-4">
        <Text className="text-sm font-semibold text-muted-foreground">Identity</Text>
        <Pressable
          onPress={pickImage}
          className="flex flex-col items-center gap-2 active:opacity-70">
          <Avatar
            alt={user?.name ?? 'Profile'}
            className="size-24 bg-secondary"
            source={{ uri: avatarUri }}
          />
          <Text className="text-sm font-medium">Edit Photo</Text>
        </Pressable>
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
      <View className="flex flex-col gap-3">
        <Text className="text-sm font-semibold text-muted-foreground">Primary Court</Text>
        <CollegeCombobox
          colleges={colleges}
          isPending={collegesPending}
          isLoading={isSavingCollege}
          selectedCollegeId={currentCollegeId}
          onSelect={(id) => saveCollege(id)}
        />
      </View>

      {/* Email */}
      <View className="flex flex-col gap-4">
        <Text className="text-sm font-semibold text-muted-foreground">Email</Text>
        <Pressable
          onPress={() => router.push('/(tabs)/(profile)/edit-email')}
          className="flex h-10 w-full min-w-0 flex-row items-center rounded-2xl border border-input bg-background px-3 py-1 text-base leading-5 text-foreground shadow-sm shadow-black/5 dark:bg-input/30">
          <Text>{user?.email}</Text>
        </Pressable>
      </View>

      {/* Account */}
      <View className="flex flex-col gap-4">
        <Text className="text-sm font-semibold text-muted-foreground">Account</Text>
        <AlertDialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
          <AlertDialogTrigger asChild>
            <Pressable>
              <Text className="font-semibold text-destructive">Sign Out</Text>
            </Pressable>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out of your account?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to sign out of your account? You will have to sign back in to
                access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-row items-center gap-2">
              <AlertDialogCancel>
                <Text>Cancel</Text>
              </AlertDialogCancel>
              <AlertDialogAction variant="destructive" onPress={() => authClient.signOut()}>
                <Text>Continue</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View>

    </NativewindScrollView>
  );
}
