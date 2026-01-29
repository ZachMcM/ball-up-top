import { patchExpoPushToken } from '@/lib/endpoints';
import { authClient } from '@/lib/auth-client';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true,
    shouldShowBanner: true
  }),
});

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission not granted');
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    console.log('No EAS project ID found');
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}

export function PushNotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (!session?.user || hasRegistered.current) return;

    const registerToken = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          await patchExpoPushToken(token);
          hasRegistered.current = true;
          console.log('Push token registered:', token);
        }
      } catch (error) {
        console.error('Failed to register push token:', error);
      }
    };

    registerToken();
  }, [session?.user]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }, []);

  return <>{children}</>;
}
