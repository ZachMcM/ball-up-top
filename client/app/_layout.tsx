import '@/global.css';
import { authClient } from '@/lib/auth-client';

import { NAV_THEME, THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import type { AppStateStatus } from 'react-native';
import { AppState, Platform } from 'react-native';
import { toast, Toaster } from 'sonner-native';

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <RootNavigatior />
        <Toaster
          toastOptions={{
            style: {
              backgroundColor: THEME[colorScheme!].background,
              borderColor: THEME[colorScheme!].border,
            },
          }}
        />
        <PortalHost />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export function RootNavigatior() {
  const { data: currentUserData, isPending: isSessionPending } = authClient.useSession();

  return (
    <Stack>
      <Stack.Protected guard={currentUserData === null}>
        <Stack.Screen
          name="index"
          options={{ title: 'Pull Up', headerBackButtonDisplayMode: 'minimal' }}
        />
        <Stack.Screen
          name="verify"
          options={{ title: 'Pull Up', headerBackButtonDisplayMode: 'minimal' }}
        />
      </Stack.Protected>
      <Stack.Protected guard={currentUserData !== null && !isSessionPending}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
