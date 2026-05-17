import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { College } from '@/types/college';
import { Portal } from '@rn-primitives/portal';
import { CheckIcon } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, Platform, Pressable, TextInput, View } from 'react-native';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';
import { Input } from '../ui/input';

const FullWindowOverlay =
  Platform.OS === 'ios'
    ? RNFullWindowOverlay
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

type DropdownPos = { top: number; left: number; width: number };

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
  const wrapperRef = useRef<View>(null);
  const inputRef = useRef<TextInput>(null);
  const [dropdownPos, setDropdownPos] = useState<DropdownPos | null>(null);
  const [inputValue, setInputValue] = useState('');

  const isOpen = dropdownPos !== null;
  const selectedCollege = colleges?.find((c) => c.id === selectedCollegeId);

  useEffect(() => {
    if (!isOpen) {
      setInputValue(selectedCollege?.name ?? '');
    }
  }, [selectedCollege, isOpen]);

  // Re-anchor after keyboard appears in case a KeyboardAvoidingView shifts the layout
  useEffect(() => {
    if (!isOpen) return;
    const sub = Keyboard.addListener('keyboardDidShow', () => {
      wrapperRef.current?.measureInWindow((x, y, width, height) => {
        setDropdownPos({ top: y + height + 4, left: x, width });
      });
    });
    return () => sub.remove();
  }, [isOpen]);

  const filteredColleges = useMemo(() => {
    const q = inputValue.toLowerCase();
    return colleges?.filter((c) => c.name.toLowerCase().includes(q) || c.abbreviation.toLowerCase().includes(q)) ?? [];
  }, [colleges, inputValue]);

  function handleFocus() {
    wrapperRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownPos({ top: y + height + 4, left: x, width });
    });
  }

  function handleClose() {
    setDropdownPos(null);
    setInputValue(selectedCollege?.name ?? '');
    inputRef.current?.blur();
  }

  function handleSelect(id: number) {
    const college = colleges?.find((c) => c.id === id);
    setInputValue(college?.name ?? '');
    setDropdownPos(null);
    onSelect(id);
    inputRef.current?.blur();
  }

  return (
    <>
      <View ref={wrapperRef}>
        <Input
          ref={inputRef}
          value={inputValue}
          onChangeText={setInputValue}
          onFocus={handleFocus}
          placeholder={isPending ? 'Loading...' : 'Select your college...'}
          editable={!isPending && !isLoading}
          autoCorrect={false}
          returnKeyType="search"
          className="rounded-2xl"
        />
        {isLoading && (
          <View className="absolute bottom-0 right-3 top-0 justify-center">
            <ActivityIndicator size="small" />
          </View>
        )}
      </View>

      {isOpen && (
        <Portal name="college-combobox">
          <FullWindowOverlay>
            <Pressable className="absolute inset-0" onPress={handleClose} />
            <View
              className="absolute z-50 mt-1.5 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-md shadow-black/5"
              style={{
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
                elevation: 8,
              }}>
              {filteredColleges?.length === 0 ? (
                <View className="items-center">
                  <Text className="text-center text-sm text-muted-foreground py-2 px-3">
                    No colleges match "{inputValue}". Try a shorter term.
                  </Text>
                </View>
              ) : (
                filteredColleges.map((college) => (
                  <Pressable
                    key={college.id}
                    onPress={() => college.id !== selectedCollegeId && handleSelect(college.id)}
                    className={cn(
                      'flex flex-row items-center justify-between rounded-lg py-2 px-3 active:opacity-70',
                      college.id === selectedCollegeId && 'bg-primary/10'
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
                      <View className="size-6 flex justify-center items-center rounded-full bg-primary">
                        <Icon strokeWidth={2.5} as={CheckIcon} size={16} className="text-primary-foreground" />
                      </View>
                    )}
                  </Pressable>
                ))
              )}
            </View>
          </FullWindowOverlay>
        </Portal>
      )}
    </>
  );
}
