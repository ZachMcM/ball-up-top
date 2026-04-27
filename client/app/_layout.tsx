import BackButton from '@/components/BackButton';
import { CourtSessionProvider } from '@/components/providers/CourtSessionProvider';
import { InvalidationProvider } from '@/components/providers/InvalidationProvider';
import { LocationProvider, useLocation } from '@/components/providers/LocationProvider';
import { PushNotificationProvider } from '@/components/providers/PushNotificationProvider';
import '@/global.css';
import { authClient } from '@/lib/auth-client';
import {
  BarlowCondensed_700Bold,
  BarlowCondensed_400Regular,
} from '@expo-google-fonts/barlow-condensed';
import {} from '@expo-google-fonts/dm-sans';
import { useFonts } from 'expo-font';

import { NAV_THEME, THEME } from '@/lib/theme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import type { AppStateStatus } from 'react-native';
import { AppState, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  setColorScheme('dark');
  
  // TODO
  useFonts({});

  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <BottomSheetModalProvider>
            <InvalidationProvider>
              <LocationProvider>
                <PushNotificationProvider>
                  <CourtSessionProvider>
                    <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                    <RootNavigator />
                  </CourtSessionProvider>
                </PushNotificationProvider>
              </LocationProvider>
            </InvalidationProvider>
            <Toaster
              toastOptions={{
                style: {
                  backgroundColor: THEME[colorScheme!].card,
                  borderColor: THEME[colorScheme!].border,
                  borderWidth: 1,
                },
              }}
            />
            <PortalHost />
          </BottomSheetModalProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export function RootNavigator() {
  const { data: currentUserData, isPending: isSessionPending } = authClient.useSession();
  const { locationPermissionStatus } = useLocation();
  const isOnboardingComplete = currentUserData?.user.onboardingStep === 'complete';

  // Show loading screen while checking session OR (when user exists, completed onboarding, AND location permission hasn't been checked yet)
  const isLoading =
    isSessionPending ||
    (currentUserData !== null && isOnboardingComplete && locationPermissionStatus === null);

  const onboardingStep = currentUserData?.user.onboardingStep!;
  const showOnboarding = !isLoading && currentUserData !== null && !isOnboardingComplete;

  return (
    <Stack>
      <Stack.Protected
        guard={
          !isLoading &&
          currentUserData !== null &&
          isOnboardingComplete &&
          locationPermissionStatus === 'granted'
        }>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isLoading && currentUserData === null}>
        <Stack.Screen
          name="auth"
          options={{ title: 'Ball Up Top', headerLeft: () => <BackButton /> }}
        />
      </Stack.Protected>
      <Stack.Protected guard={showOnboarding && onboardingStep === 'name'}>
        <Stack.Screen
          name="(onboarding)/name"
          options={{
            title: 'Ball Up Top',
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={showOnboarding && onboardingStep === 'height'}>
        <Stack.Screen
          name="(onboarding)/height"
          options={{
            title: 'Ball Up Top',
            headerBackVisible: false,
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={showOnboarding && onboardingStep === 'image'}>
        <Stack.Screen
          name="(onboarding)/image"
          options={{
            title: 'Ball Up Top',
            headerBackVisible: false,
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={showOnboarding && onboardingStep === 'primaryCollege'}>
        <Stack.Screen
          name="(onboarding)/primary-college"
          options={{
            title: 'Ball Up Top',
            headerBackVisible: false,
          }}
        />
      </Stack.Protected>
      <Stack.Protected
        guard={
          !isLoading &&
          currentUserData !== null &&
          isOnboardingComplete &&
          locationPermissionStatus !== 'granted'
        }>
        <Stack.Screen
          name="location-permission"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={isLoading}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="loading"
        />
      </Stack.Protected>
      <Stack.Screen
        options={{
          presentation: 'modal',
          title: 'Rate Players',
        }}
        name="rate"
      />
    </Stack>
  );
}
