import { LocationProvider, useLocation } from '@/components/providers/LocationProvider';
import '@/global.css';
import { authClient } from '@/lib/auth-client';

import { NAV_THEME, THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, usePathname, useRouter } from 'expo-router';
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
  const { colorScheme } = useColorScheme();

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
        <LocationProvider>
          <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <RootNavigatior />
            <Toaster
              toastOptions={{
                style: {
                  backgroundColor: THEME[colorScheme!].popover,
                  borderColor: THEME[colorScheme!].border,
                  borderWidth: 1,
                },
              }}
            />
            <PortalHost />
          </ThemeProvider>
        </LocationProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export function RootNavigatior() {
  const { data: currentUserData, isPending: isSessionPending } = authClient.useSession();
  const { locationPermissionStatus, isLocationPermissionPending } = useLocation();
  const isOnboardingComplete = currentUserData?.user.onboardingStep === 'complete';

  // Show loading screen while checking session OR (when user exists AND checking location)
  const isLoading = isSessionPending || (currentUserData !== null && isLocationPermissionPending);

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
        <Stack.Screen
          name="add-court"
          options={{
            presentation: 'modal',
            title: 'Add Court',
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isLoading && currentUserData === null}>
        <Stack.Screen
          name="(auth)/signin"
          options={{ title: 'Pull Up', headerBackButtonDisplayMode: 'minimal' }}
        />
        <Stack.Screen
          name="(auth)/verify-otp"
          options={{ title: 'Pull Up', headerBackButtonDisplayMode: 'minimal' }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isLoading && currentUserData !== null && !isOnboardingComplete}>
        <Stack.Screen
          name="(onboarding)/name"
          options={{
            title: 'Pull Up',
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Stack.Screen
          name="(onboarding)/height"
          options={{
            title: 'Pull Up',
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Stack.Screen
          name="(onboarding)/image"
          options={{
            title: 'Pull Up',
            headerBackButtonDisplayMode: 'minimal',
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
    </Stack>
  );
}
