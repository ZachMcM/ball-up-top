import { authClient } from '@/lib/auth-client';
import * as Location from 'expo-location';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';

interface LocationContextValues {
  hasLocationPermission: boolean | null;
  isPending: boolean;
  requestPermission: () => Promise<void>;
  getLocation: () => Promise<Location.LocationObject>;
}
const LocationContext = createContext<LocationContextValues | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const { data: currentUserData, isPending: isSessionPending } = authClient.useSession();
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Check location permission status
  useEffect(() => {
    const checkLocationPermission = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
    };

    if (!isSessionPending && currentUserData?.user.onboardingStep === 'complete') {
      checkLocationPermission();
      const subscription = AppState.addEventListener('change', (state) => {
        if (state === 'active') {
          checkLocationPermission();
        }
      });
      return () => subscription.remove();
    }
  }, [isSessionPending, currentUserData?.user.onboardingStep]);

  const requestPermission = async () => {
    setIsPending(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        return;
      } else {
        setHasLocationPermission(true);
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setHasLocationPermission(false);
    } finally {
      setIsPending(false);
    }
  };

  const getLocation = async () => {
    return Location.getCurrentPositionAsync();
  };

  return (
    <LocationContext.Provider
      value={{
        isPending,
        getLocation,
        requestPermission,
        hasLocationPermission,
      }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext) as LocationContextValues;
}
