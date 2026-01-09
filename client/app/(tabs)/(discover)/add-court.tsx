import { NativewindScrollView } from '@/components/NativewindScrollView';
import { useLocation } from '@/components/providers/LocationProvider';
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
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { getPlaces, postCourt } from '@/lib/endpoints';
import { cn } from '@/lib/utils';
import { Place, PlaceSchema } from '@/types/court';
import { ImagePickerAssetSchema } from '@/types/imagePickerAsset';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Ban,
  CheckIcon,
  HouseIcon,
  ImageIcon,
  MapPin,
  SaveIcon,
  SunIcon,
} from 'lucide-react-native';
import { Fragment, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { toast } from 'sonner-native';
import { useDebounce } from 'use-debounce';
import * as z from 'zod';

export const AddCourtSchema = z.object({
  place: PlaceSchema,
  nickname: z.string().optional(),
  indoor: z.boolean(),
  image: ImagePickerAssetSchema,
  name: z.string().min(1),
});

export default function AddCourtPage() {
  const [step, setStep] = useState<0 | 1>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 250);

  const { control, setValue, handleSubmit, watch, formState } = useForm<
    z.infer<typeof AddCourtSchema>
  >({
    resolver: zodResolver(AddCourtSchema),
  });

  const { place: selectedPlace } = watch();

  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: saveCourt, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof AddCourtSchema>) => await postCourt(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courts'] });
      toast.success(
        "Court successfully added! Please check back soon to review it's verification status.",
        {
          position: 'bottom-center',
        }
      );
      router.dismiss();
    },
    onError: (error) => {
      console.log('Error', error);
      toast.error(error.message, { position: 'bottom-center' });
    },
  });

  const { location } = useLocation();

  const { data: places, isPending: arePlacesPending } = useQuery({
    queryKey: [
      'places',
      {
        searchQuery: debouncedSearchQuery,
        lat: location?.coords.latitude,
        lng: location?.coords.longitude,
      },
    ],
    queryFn: async () => {
      const courts = await getPlaces(
        debouncedSearchQuery,
        location?.coords.latitude!,
        location?.coords.longitude!
      );
      return courts;
    },
    staleTime: 1000 * 60,
  });

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setValue('image', result.assets[0]);
    }
  }

  function selectPlace(place: Place) {
    Keyboard.dismiss();
    setValue('place', place);
    setValue('name', place.name);
    setStep(1);
    setSearchQuery('');
  }

  function handleBack() {
    setStep(0);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <NativewindScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="flex w-full flex-col gap-6 px-4 py-6"
        keyboardShouldPersistTaps="handled">
        <View className="flex w-full flex-row items-center gap-1.5">
          <View className="h-1 flex-1 rounded-full bg-primary" />
          <View className={cn('h-1 flex-1 rounded-full bg-muted', step === 1 && 'bg-primary')} />
        </View>
        {step === 0 ? (
          <Fragment>
            <View className="flex flex-col">
              <Text className="text-lg font-bold">Where's the court?</Text>
              <Text className="text-sm font-medium text-muted-foreground">
                Search for the address or use your current location
              </Text>
            </View>
            <Input
              autoFocus
              value={searchQuery}
              onChangeText={(val) => {
                setSearchQuery(val);
              }}
              className="rounded-full"
              placeholder="Search for an address..."
            />
            {arePlacesPending ? (
              <ActivityIndicator />
            ) : places && places.length !== 0 ? (
              <View className="flex flex-col gap-3">
                <Text className="text-sm font-medium text-muted-foreground">Results</Text>
                {places.map((place) => (
                  <Pressable onPress={() => selectPlace(place)} key={place.id}>
                    <View className="flex flex-row items-center gap-3.5 rounded-2xl border border-border px-4 py-3">
                      <View className="flex size-8 items-center justify-center rounded-lg border border-border bg-muted/50">
                        <Icon size={16} as={MapPin} />
                      </View>
                      <View className="flex flex-1 flex-col">
                        <Text className="font-semibold">{place.name}</Text>
                        <Text className="text-sm font-medium text-muted-foreground">
                          {place.formattedAddress}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              searchQuery.trim() !== '' && (
                <Empty className="border border-dashed border-border">
                  <EmptyHeader>
                    <EmptyMedia variant="icon" className="rounded-md">
                      <Icon size={18} as={Ban} />
                    </EmptyMedia>
                    <EmptyTitle>No Places Found</EmptyTitle>
                    <EmptyDescription>
                      No places found nearby. Try a different search.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )
            )}
          </Fragment>
        ) : (
          <Fragment>
            <View className="flex flex-col">
              <Text className="text-lg font-bold">Court Details</Text>
              <Text className="text-sm font-medium text-muted-foreground">
                {selectedPlace.formattedAddress}
              </Text>
            </View>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { value }, fieldState: { error } }) => (
                <View className="flex w-full flex-1 flex-col gap-2">
                  <Pressable onPress={pickImage}>
                    <AspectRatio
                      ratio={4 / 1}
                      className={cn(
                        'rounded-md',
                        value !== undefined
                          ? 'relative overflow-hidden'
                          : 'flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/30'
                      )}>
                      {value !== undefined ? (
                        <Image
                          source={{
                            uri: value.uri,
                          }}
                          style={{ width: '100%', height: '100%' }}
                          className="absolute inset-0 object-cover"
                        />
                      ) : (
                        <Fragment>
                          <View className="flex size-9 items-center justify-center rounded-md bg-input">
                            <Icon size={20} as={ImageIcon} />
                          </View>
                          <Text className="text-center text-sm font-medium text-muted-foreground">
                            Upload an image
                          </Text>
                        </Fragment>
                      )}
                    </AspectRatio>
                  </Pressable>
                  {error && (
                    <Text className="text-sm font-medium text-destructive">{error.message}</Text>
                  )}
                </View>
              )}
              name="image"
            />
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View className="flex flex-col gap-2">
                  <Label>Court Name *</Label>
                  <Input
                    placeholder="Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    className={cn(error && 'border-destructive')}
                    value={value}
                  />
                  {error && (
                    <Text className="text-sm font-medium text-destructive">{error.message}</Text>
                  )}
                </View>
              )}
              name="name"
            />
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View className="flex flex-col gap-2">
                  <Label>Nickname (optional)</Label>
                  <Input
                    placeholder="Nickname"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    className={cn(error && 'border-destructive')}
                    value={value}
                  />
                  {error && (
                    <Text className="text-sm font-medium text-destructive">{error.message}</Text>
                  )}
                </View>
              )}
              name="nickname"
            />
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value: indoor }, fieldState: { error } }) => (
                <View className="flex w-full flex-1 flex-col gap-2">
                  <View className="flex w-full flex-row items-center gap-2">
                    <Button
                      onPress={() => onChange(true)}
                      className="flex-1"
                      size="lg"
                      variant={indoor ? 'secondary' : 'outline'}>
                      <Icon size={18} as={HouseIcon} />
                      <Text>Indoor</Text>
                    </Button>
                    <Button
                      onPress={() => onChange(false)}
                      className="flex-1"
                      size="lg"
                      variant={indoor === false ? 'secondary' : 'outline'}>
                      <Icon size={18} as={SunIcon} />
                      <Text>Outdoor</Text>
                    </Button>
                  </View>
                  {error && (
                    <Text className="text-sm font-medium text-destructive">{error.message}</Text>
                  )}
                </View>
              )}
              name="indoor"
            />
            <View className="flex w-full flex-row items-center gap-2">
              <Button
                disabled={isPending}
                onPress={handleBack}
                className="flex-1"
                size="lg"
                variant="outline">
                <Icon size={18} as={ArrowLeft} />
                <Text>Back</Text>
              </Button>
              <AlertDialog className="flex-1">
                <AlertDialogTrigger asChild>
                  <Button disabled={isPending} className="flex-1">
                    <Text>Save</Text>
                    {isPending ? (
                      <ActivityIndicator />
                    ) : (
                      <Icon className="text-primary-foreground" size={18} as={CheckIcon} />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to add this court?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Make sure all the information is correct before adding the court.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex flex-row items-center">
                    <AlertDialogCancel>
                      <Text>Cancel</Text>
                    </AlertDialogCancel>
                    <AlertDialogAction onPress={handleSubmit((values) => saveCourt(values))}>
                      <Text>Confirm</Text>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </View>
          </Fragment>
        )}
      </NativewindScrollView>
    </KeyboardAvoidingView>
  );
}
