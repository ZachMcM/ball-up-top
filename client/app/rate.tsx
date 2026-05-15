import { ArchetypeDisplay } from '@/components/design/ArchetypeDisplay';
import { NativewindScrollView } from '@/components/NativewindScrollView';
import { useCourtSession } from '@/components/providers/CourtSessionProvider';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import {
  getEncounteredPlayers,
  getUserHasSubmittedRatings,
  patchEncounteredPlayer,
  postSessionRatings,
} from '@/lib/endpoints';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  SkipForward,
} from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';
import { toast } from 'sonner-native';
import { useDebounce } from 'use-debounce';

const MIN_RATING = 45;
const MAX_RATING = 99;

const PRESETS = [
  { label: 'Avg', value: 65 },
  { label: 'Solid', value: 75 },
  { label: 'Great', value: 85 },
  { label: 'Elite', value: 95 },
] as const;

const INITIAL_DELAY = 400;
const REPEAT_INTERVAL = 80;

type LocalRatings = {
  defenseRating: number;
  finishingRating: number;
  shootingRating: number;
  playmakingRating: number;
};

function RatingInput({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
}) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  const startDecrement = useCallback(() => {
    if (valueRef.current > MIN_RATING) {
      onValueChange(valueRef.current - 1);
    }
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (valueRef.current > MIN_RATING) {
          onValueChange(valueRef.current - 1);
        } else {
          clearTimers();
        }
      }, REPEAT_INTERVAL);
    }, INITIAL_DELAY);
  }, [onValueChange, clearTimers]);

  const startIncrement = useCallback(() => {
    if (valueRef.current < MAX_RATING) {
      onValueChange(valueRef.current + 1);
    }
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (valueRef.current < MAX_RATING) {
          onValueChange(valueRef.current + 1);
        } else {
          clearTimers();
        }
      }, REPEAT_INTERVAL);
    }, INITIAL_DELAY);
  }, [onValueChange, clearTimers]);

  return (
    <View className="flex flex-col gap-2">
      <View className="flex flex-row items-center justify-between">
        <Text className="text-lg font-semibold">{label}</Text>
        <View className="flex flex-row items-center gap-5">
          <Button
            onPressIn={startDecrement}
            onPressOut={clearTimers}
            disabled={value <= MIN_RATING}
            variant="ghost"
            size="icon"
            className="size-8">
            <Icon size={20} as={MinusIcon} />
          </Button>
          <View className="flex size-12 flex-row items-center justify-center">
            <Text className="font-bebas text-3xl leading-10">{value}</Text>
          </View>
          <Button
            onPressIn={startIncrement}
            onPressOut={clearTimers}
            disabled={value >= MAX_RATING}
            variant="ghost"
            size="icon"
            className="size-8">
            <Icon size={20} as={PlusIcon} />
          </Button>
        </View>
      </View>
      <View className="flex flex-row items-center gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            onPress={() => onValueChange(preset.value)}
            className="flex-1"
            size="sm"
            variant={preset.value === value ? 'secondary' : 'outline'}>
            <Text>{preset.label}</Text>
          </Button>
        ))}
      </View>
    </View>
  );
}

export default function RatePage() {
  const { unratedCourtSession } = useCourtSession();
  const sessionId = unratedCourtSession?.id;

  const [step, setStep] = useState(0);
  const [localRatings, setLocalRatings] = useState<LocalRatings>({
    defenseRating: MIN_RATING,
    finishingRating: MIN_RATING,
    shootingRating: MIN_RATING,
    playmakingRating: MIN_RATING,
  });
  const [explainerAcknowledged, setExplainerAcknowledged] = useState(false);

  const [debouncedRatings] = useDebounce(localRatings, 500);
  const hasSubmittedRef = useRef(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: hasSubmittedRatingsData, isPending: isHasSubmittedRatingsPending } = useQuery({
    queryKey: ['has-submitted-ratings'],
    queryFn: getUserHasSubmittedRatings,
  });

  const showExplainer =
    !isHasSubmittedRatingsPending &&
    !hasSubmittedRatingsData?.hasSubmittedRatings &&
    !explainerAcknowledged;

  const {
    data: encounteredPlayers,
    isPending: arePlayersPending,
    refetch,
  } = useQuery({
    queryKey: ['courtSession', sessionId, 'encountered-players'],
    queryFn: () => getEncounteredPlayers(sessionId!),
    enabled: !!sessionId,
  });

  const currentPlayer = encounteredPlayers?.[step];
  const totalSteps = encounteredPlayers?.length ?? 0;
  const isFirstStep = step === 0;
  const isLastStep = step === totalSteps - 1;

  useEffect(() => {
    if (currentPlayer) {
      setLocalRatings({
        defenseRating: currentPlayer.defenseRating ?? currentPlayer.rateeDefenseAtTime,
        finishingRating: currentPlayer.finishingRating ?? currentPlayer.rateeFinishingAtTime,
        shootingRating: currentPlayer.shootingRating ?? currentPlayer.rateeShootingAtTime,
        playmakingRating: currentPlayer.playmakingRating ?? currentPlayer.rateePlaymakingAtTime,
      });
    }
  }, [step, currentPlayer?.id]);

  const { mutate: updateDraft } = useMutation({
    mutationFn: async (data: Partial<LocalRatings>) => {
      if (!currentPlayer) return;
      await patchEncounteredPlayer(currentPlayer.id, { ...data, skipped: false });
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Failed to save draft:', error);
    },
  });

  useEffect(() => {
    if (currentPlayer && !hasSubmittedRef.current) {
      updateDraft(debouncedRatings);
    }
  }, [debouncedRatings, currentPlayer?.id]);

  const { mutate: skipPlayer, isPending: isSkipping } = useMutation({
    mutationFn: async () => {
      if (!currentPlayer || !sessionId) return;
      if (isLastStep) {
        hasSubmittedRef.current = true;
      }
      await patchEncounteredPlayer(currentPlayer.id, { skipped: true });
      if (isLastStep) {
        await postSessionRatings(sessionId);
      }
    },
    onSuccess: () => {
      if (isLastStep) {
        queryClient.setQueryData(['courtSession', 'unrated'], null);
        toast.success('Ratings submitted successfully!', { position: 'bottom-center' });
        router.dismiss();
      } else {
        refetch();
        setStep((prev) => prev + 1);
      }
    },
    onError: (error) => {
      toast.error(error.message, { position: 'bottom-center' });
    },
  });

  const { mutate: submitRatings, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      if (!sessionId) return;
      hasSubmittedRef.current = true;
      if (currentPlayer) {
        await patchEncounteredPlayer(currentPlayer.id, { ...localRatings, skipped: false });
      }
      await postSessionRatings(sessionId);
    },
    onSuccess: () => {
      queryClient.setQueryData(['courtSession', 'unrated'], null);
      toast.success('Ratings submitted successfully!', { position: 'bottom-center' });
      router.dismiss();
    },
    onError: (error) => {
      toast.error(error.message, { position: 'bottom-center' });
    },
  });

  function handleNext() {
    setStep((prev) => prev + 1);
  }

  function handleBack() {
    setStep((prev) => prev - 1);
  }

  function handleSkip() {
    skipPlayer();
  }

  // Count rated players for confirmation message
  const ratedCount = encounteredPlayers?.filter(
    (ep) =>
      !ep.skipped &&
      ep.defenseRating !== null &&
      ep.finishingRating !== null &&
      ep.shootingRating !== null &&
      ep.playmakingRating !== null
  ).length!;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <NativewindScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="flex w-full flex-col gap-6 px-4 py-6"
        keyboardShouldPersistTaps="handled">
        {isHasSubmittedRatingsPending || arePlayersPending ? (
          <ActivityIndicator />
        ) : showExplainer ? (
          <View className="flex flex-1 flex-col items-center justify-center gap-6 py-12">
            <Text className="text-center text-2xl font-bold">How Ratings Work</Text>

            <View className="flex flex-col gap-4 max-w-xs">
              <Text className="text-center text-base text-muted-foreground">
                &bull; Rate each player across four skills: Defense, Finishing, Shooting, and Playmaking.
              </Text>

              <Text className="text-center text-base text-muted-foreground">
                &bull; Use the presets or adjust manually. Be honest about what you saw on the court.
              </Text>

              <Text className="text-center text-base text-muted-foreground">
                &bull; Your specific scores stay anonymous. Players see their averages, not who said what.
              </Text>

              <Text className="text-center text-sm font-medium">
                Fair ratings make everyone's OVR accurate, including yours.
              </Text>
            </View>

            <Button className="w-full max-w-xs" size="lg" onPress={() => setExplainerAcknowledged(true)}>
              <Text>Got it</Text>
            </Button>
          </View>
        ) : (
          encounteredPlayers &&
          currentPlayer && (
            <>
              <View className="flex flex-col gap-3">
                <View className="flex flex-row items-center justify-between">
                  <Text className="text-lg font-semibold">
                    Player {step + 1} of {totalSteps}
                  </Text>
                  <Text className="text-sm font-medium">{(((step + 1) / totalSteps) * 100).toFixed(0)}%</Text>
                </View>
                <Progress className="h-1" value={((step + 1) / totalSteps) * 100} />
              </View>
              <View className="flex flex-row items-center gap-4">
                <Avatar
                  source={{ uri: currentPlayer.rateeImage ?? undefined }}
                  className="size-16"
                  alt={`${currentPlayer.rateeName}'s image`}
                />
                <View className="flex flex-1 flex-col gap-1.5">
                  <Text className="text-xl font-bold">{currentPlayer.rateeName}</Text>
                  <ArchetypeDisplay
                    tone="muted"
                    size="md"
                    variant="inline"
                    archetype={currentPlayer.rateeArchetype}
                  />
                </View>
                <View className="flex flex-col items-center">
                  <Text className="font-bebas text-3xl leading-none">
                    {currentPlayer.rateeOverallAtTime}
                  </Text>
                  <Text className="font-medium text-muted-foreground">Overall</Text>
                </View>
              </View>
              <View className="flex flex-col gap-4">
                <RatingInput
                  label="Defense"
                  value={localRatings.defenseRating}
                  onValueChange={(val) =>
                    setLocalRatings((prev) => ({ ...prev, defenseRating: val }))
                  }
                />
                <RatingInput
                  label="Finishing"
                  value={localRatings.finishingRating}
                  onValueChange={(val) =>
                    setLocalRatings((prev) => ({ ...prev, finishingRating: val }))
                  }
                />
                <RatingInput
                  label="Shooting"
                  value={localRatings.shootingRating}
                  onValueChange={(val) =>
                    setLocalRatings((prev) => ({ ...prev, shootingRating: val }))
                  }
                />
                <RatingInput
                  label="Playmaking"
                  value={localRatings.playmakingRating}
                  onValueChange={(val) =>
                    setLocalRatings((prev) => ({ ...prev, playmakingRating: val }))
                  }
                />
              </View>
              <View className="flex w-full flex-row items-center gap-2">
                <Button
                  disabled={isFirstStep || isSubmitting || isSkipping}
                  onPress={handleBack}
                  variant="outline"
                  className="flex-1">
                  <Icon size={18} as={ArrowLeft} />
                  <Text>Back</Text>
                </Button>
                {isLastStep ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button disabled={isSubmitting || isSkipping} variant="ghost">
                        {isSkipping ? (
                          <ActivityIndicator size="small" />
                        ) : (
                          <Icon size={18} as={SkipForward} />
                        )}
                        <Text>Skip</Text>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Skip & Submit?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {ratedCount === 0
                            ? "You haven't rated any players. Are you sure you want to skip rating this session?"
                            : `You're about to skip this player and submit ratings for ${ratedCount} player${ratedCount > 1 ? 's' : ''}.`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-row items-center">
                        <AlertDialogCancel>
                          <Text>Cancel</Text>
                        </AlertDialogCancel>
                        <AlertDialogAction onPress={handleSkip}>
                          <Text>Confirm</Text>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button
                    disabled={isSubmitting || isSkipping}
                    onPress={handleSkip}
                    variant="ghost">
                    {isSkipping ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      <Icon size={18} as={SkipForward} />
                    )}
                    <Text>Skip</Text>
                  </Button>
                )}
                {isLastStep ? (
                  <AlertDialog className="flex-1">
                    <AlertDialogTrigger asChild>
                      <Button disabled={isSubmitting} className="flex-1">
                        <Text>Submit</Text>
                        {isSubmitting ? (
                          <ActivityIndicator size="small" />
                        ) : (
                          <Icon className="text-primary-foreground" size={18} as={CheckIcon} />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Submit Ratings?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {ratedCount === 0
                            ? "You haven't rated any players. Are you sure you want to skip rating this session?"
                            : `You're about to submit ratings for ${ratedCount} player${ratedCount > 1 ? 's' : ''}. Please make sure all your ratings are accurate and fair before submitting.`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-row items-center">
                        <AlertDialogCancel>
                          <Text>Cancel</Text>
                        </AlertDialogCancel>
                        <AlertDialogAction onPress={() => submitRatings()}>
                          <Text>Confirm</Text>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button
                    disabled={isSubmitting || isSkipping}
                    onPress={handleNext}
                    className="flex-1">
                    <Text>Next</Text>
                    <Icon className="text-primary-foreground" size={18} as={ArrowRight} />
                  </Button>
                )}
              </View>
            </>
          )
        )}
      </NativewindScrollView>
    </KeyboardAvoidingView>
  );
}
