import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNormalizedTime(hour: number) {
  return hour === 0 ? '12am' : hour === 12 ? "12pm" : hour + 1 > 12 ? `${hour - 12}pm` : `${hour}am`;
}
