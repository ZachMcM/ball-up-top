import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { College } from '@/types/college';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { CheckIcon, ChevronDownIcon } from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { NativewindFlatList } from '../NativewindFlatList';
import { Input } from '../ui/input';

type CollegeComboboxProps = {
  colleges: College[] | undefined;
  isPending?: boolean;
  isLoading?: boolean;
  selectedCollegeId?: number;
  onSelect: (collegeId: number) => void;
};

export function CollegeCombobox({
  colleges,
  isPending,
  isLoading,
  selectedCollegeId,
  onSelect,
}: CollegeComboboxProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { colorScheme } = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingCollegeId, setPendingCollegeId] = useState<number | null>(null);
  const pendingCollegeIdRef = useRef<number | null>(null);

  const selectedCollege = colleges?.find((c) => c.id === selectedCollegeId);
  const pendingCollege = colleges?.find((c) => c.id === pendingCollegeId);

  const filteredColleges = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return (
      colleges?.filter(
        (c) => c.name.toLowerCase().includes(q) || c.abbreviation.toLowerCase().includes(q)
      ) ?? []
    );
  }, [colleges, searchQuery]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  function handleOpen() {
    if (isPending || isLoading) return;
    bottomSheetRef.current?.present();
  }

  function handleSelectCollege(id: number) {
    if (id === selectedCollegeId) return;
    pendingCollegeIdRef.current = id;
    bottomSheetRef.current?.dismiss();
  }

  function handleSheetDismiss() {
    setSearchQuery('');
    if (pendingCollegeIdRef.current !== null) {
      setPendingCollegeId(pendingCollegeIdRef.current);
      pendingCollegeIdRef.current = null;
    }
  }

  function handleConfirm() {
    if (pendingCollegeId !== null) {
      onSelect(pendingCollegeId);
      setPendingCollegeId(null);
    }
  }

  return (
    <>
      <Pressable
        onPress={handleOpen}
        disabled={isPending || isLoading}
        className={cn(
          'flex h-10 w-full min-w-0 flex-row items-center justify-between rounded-2xl border border-input bg-background px-3 shadow-sm shadow-black/5 dark:bg-input/30',
          (isPending || isLoading) && 'opacity-50'
        )}>
        <Text className={cn('text-base leading-5', !selectedCollege && 'text-muted-foreground')}>
          {isPending ? 'Loading...' : (selectedCollege?.name ?? 'Select your college...')}
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Icon as={ChevronDownIcon} size={16} className="text-muted-foreground" />
        )}
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['75%', '100%']}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: THEME[colorScheme!].background }}
        handleIndicatorStyle={{ backgroundColor: THEME[colorScheme!].muted }}
        onDismiss={handleSheetDismiss}>
        <BottomSheetView className="flex flex-1 flex-col gap-4">
          <View className="py-2.5 px-4">
            <Input
              className="h-9 rounded-full"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search colleges..."
              autoCorrect={false}
              onFocus={() => bottomSheetRef.current?.snapToIndex(1)}
            />
          </View>
          <NativewindFlatList
            data={filteredColleges}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: college, index }) => (
              <Pressable
                onPress={() => handleSelectCollege(college.id)}
                className={cn(
                  'flex flex-row items-center justify-between border-b border-border px-4 py-3',
                  college.id === selectedCollegeId && 'bg-muted-foreground/10 dark:bg-card',
                  index === 0 && 'border-t'
                )}>
                <View className="flex flex-col gap-0.5">
                  <Text
                    className={cn(
                      'text-sm',
                      college.id === selectedCollegeId ? 'font-semibold' : 'font-medium'
                    )}>
                    {college.name}
                  </Text>
                  <Text className="text-xs text-muted-foreground">{college.abbreviation}</Text>
                </View>
                {college.id === selectedCollegeId && (
                  <View className="flex size-6 items-center justify-center rounded-full bg-primary">
                    <Icon
                      strokeWidth={2.5}
                      as={CheckIcon}
                      size={16}
                      className="text-primary-foreground"
                    />
                  </View>
                )}
              </Pressable>
            )}
            ListEmptyComponent={
              <View className="items-center py-8">
                <Text className="px-6 text-center text-sm text-muted-foreground">
                  No colleges match "{searchQuery}". Try a shorter term.
                </Text>
              </View>
            }
          />
        </BottomSheetView>
      </BottomSheetModal>

      <AlertDialog
        open={pendingCollegeId !== null}
        onOpenChange={(open) => !open && setPendingCollegeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch primary court?</AlertDialogTitle>
            <AlertDialogDescription>
              Your leaderboard and home feed will switch to {pendingCollege?.name ?? 'this court'}.
              You can always change it back.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row items-center">
            <AlertDialogCancel onPress={() => setPendingCollegeId(null)}>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={handleConfirm}>
              <Text>Switch</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
