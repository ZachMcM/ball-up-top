import { useSegments } from 'expo-router';

export type TabContext = 'activity' | 'discover' | 'profile';

/**
 * Returns the current tab context based on the route segments.
 * Useful for navigating to shared routes while staying in the same tab.
 */
export function useTabContext(): TabContext {
  const segments = useSegments();
  // Segments look like: ["(tabs)", "(discover)", "user", "[userId]"]
  for (const segment of segments) {
    if (segment === '(activity)') return 'activity';
    if (segment === '(discover)') return 'discover';
    if (segment === '(profile)') return 'profile';
  }
  return 'discover'; // Default fallback
}
