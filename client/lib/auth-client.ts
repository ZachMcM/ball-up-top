import { expoClient } from '@better-auth/expo/client';
import { emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
  sessionOptions: {
    refetchOnWindowFocus: false,
  },
  plugins: [
    expoClient({
      scheme: 'ball-up-top-client',
      storagePrefix: 'ball-up-top-client',
      storage: SecureStore,
    }),
    emailOTPClient(),
    inferAdditionalFields({
      user: {
        onboardingStep: {
          type: 'string',
        },
        height: {
          type: 'string',
        },
        primaryCollegeId: {
          type: 'number',
        },
      },
    }),
  ],
});
