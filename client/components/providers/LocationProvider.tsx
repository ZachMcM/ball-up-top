import { authClient } from '@/lib/auth-client';
import * as Location from 'expo-location';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';

interface LocationContextValues {
  locationPermissionStatus: 'granted' | 'denied' | 'undetermined' | null;
  isRequestingPermission: boolean;
  isCheckingLocationPermission: boolean;
  isLocationPermissionPending: boolean;
  requestPermission: () => Promise<void>;
  location: Location.LocationObject | null;
  isUpdatingLocation: boolean;
  isLocationPending: boolean;
}
const LocationContext = createContext<LocationContextValues | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const { data: currentUserData, isPending: isSessionPending } = authClient.useSession();
  const [isCheckingLocationPermission, setIsCheckingLocationPermission] = useState(false);
  const [locationPermissionStatus, setlocationPermissionStatus] = useState<
    null | 'granted' | 'denied' | 'undetermined'
  >(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const isLocationPermissionPending =
    isCheckingLocationPermission && locationPermissionStatus === null;

  const isLocationPending = isUpdatingLocation && location === null;
  // Reset location permission state when user logs out

  useEffect(() => {
    if (currentUserData === null) {
      setlocationPermissionStatus(null);
      setLocation(null);
    }
  }, [currentUserData]);

  const updateLocation = async () => {
    setIsUpdatingLocation(true);
    const location = await Location.getCurrentPositionAsync();
    setLocation(location);
    setIsUpdatingLocation(false);
  };

  useEffect(() => {
    if (locationPermissionStatus === 'granted') {
      (async () => {
        await updateLocation();
      })();
    }
  }, [isSessionPending, currentUserData?.user.onboardingStep, locationPermissionStatus]);

  // Check location permission status
  useEffect(() => {
    const checkLocationPermission = async () => {
      setIsCheckingLocationPermission(true);
      const { status } = await Location.getForegroundPermissionsAsync();
      setlocationPermissionStatus(status);
      setIsCheckingLocationPermission(false);
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
    setIsRequestingPermission(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setlocationPermissionStatus(status);
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setlocationPermissionStatus('undetermined');
    } finally {
      setIsRequestingPermission(false);
    }
  };
  // In LocationProvider - update every 5 minutes while app is active
  useEffect(() => {
    if (locationPermissionStatus !== 'granted') return;

    const interval = setInterval(
      async () => {
        await updateLocation();
      },
      5 * 60 * 1000
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [locationPermissionStatus]);

  return (
    <LocationContext.Provider
      value={{
        isRequestingPermission,
        isCheckingLocationPermission,
        isLocationPermissionPending,
        locationPermissionStatus,
        location,
        isUpdatingLocation,
        isLocationPending,
        requestPermission,
      }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext) as LocationContextValues;
}
