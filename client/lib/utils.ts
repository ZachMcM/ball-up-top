import { clsx, type ClassValue } from 'clsx';
import { Linking, Platform } from 'react-native';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const openDirections = (address: string) => {
  const encodedAddress = encodeURIComponent(address);

  const url = Platform.select({
    ios: `maps:0,0?q=${encodedAddress}`, // Apple Maps
    android: `geo:0,0?q=${encodedAddress}`, // Google Maps
  });

  Linking.openURL(url!);
};

export const getInitials = (name: string) => `${name.split(' ')[0]} ${name.split(' ')[1]}`;
