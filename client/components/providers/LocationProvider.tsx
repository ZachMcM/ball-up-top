import { authClient } from '@/lib/auth-client';
import * as Location from 'expo-location';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';

interface LocationContextValues {
  hasLocationPermission: boolean | null;
  isRequestingPermission: boolean;
  requestPermission: () => Promise<void>;
  location: Location.LocationObject | null;
  isLocationPending: boolean;
}
const LocationContext = createContext<LocationContextValues | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const { data: currentUserData, isPending: isSessionPending } = authClient.useSession();
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [isLocationPending, setIsLocationPending] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const updateLocation = async () => {
    const location = await Location.getCurrentPositionAsync();
    setLocation(location);
  };

  useEffect(() => {
    if (hasLocationPermission) {
      (async () => {
        setIsLocationPending(true);
        await updateLocation();
        setIsLocationPending(false);
      })();
    }
  }, [isSessionPending, currentUserData?.user.onboardingStep, hasLocationPermission]);

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
          updateLocation();
        }
      });
      return () => subscription.remove();
    }
  }, [isSessionPending, currentUserData?.user.onboardingStep]);

  const requestPermission = async () => {
    setIsRequestingPermission(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setHasLocationPermission(false);
    } finally {
      setIsRequestingPermission(false);
    }
  };
  // In LocationProvider - update every 5 minutes while app is active
  useEffect(() => {
    if (!hasLocationPermission) return;

    const interval = setInterval(
      async () => {
        await updateLocation();
      },
      5 * 60 * 1000
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [hasLocationPermission]);

  return (
    <LocationContext.Provider
      value={{
        isRequestingPermission,
        requestPermission,
        hasLocationPermission,
        location,
        isLocationPending,
      }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext) as LocationContextValues;
}
