import { clsx, type ClassValue } from 'clsx';
import { formatDistanceToNow } from "date-fns";
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

export function getDistanceInMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8; // Earth's radius in miles
  const phi_1 = (lat1 * Math.PI) / 180;
  const phi_2 = (lat2 * Math.PI) / 180;
  const delta_phi = ((lat2 - lat1) * Math.PI) / 180;
  const delta_lambda = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(delta_phi / 2) * Math.sin(delta_phi / 2) +
    Math.cos(phi_1) * Math.cos(phi_2) * Math.sin(delta_lambda / 2) * Math.sin(delta_lambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}


export function timeAgo(date: Date | string): string {
  const parsedDate =
    typeof date === "string"
      ? new Date(date.replace(" ", "T").replace(/(\+\d{2})$/, "$1:00"))
      : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
}