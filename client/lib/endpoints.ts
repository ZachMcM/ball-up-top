import { AddCourtSchema } from '@/app/(tabs)/(discover)/add-court';
import { Court, CourtListEntry, CourtSession, Place } from '@/types/court';
import { EncounteredPlayer } from '@/types/encounteredPlayer';
import { ExtendedUser, User } from '@/types/user';
import { ImagePickerAsset } from 'expo-image-picker';
import * as z from 'zod';
import { authClient } from './auth-client';
import { Activity } from '@/types/activity';
import { Rating } from '@/types/rating';

export type serverRequestParams = {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: string;
  formData?: FormData;
  tokenOverride?: string;
};

export async function serverRequest({ endpoint, method, body, formData }: serverRequestParams) {
  const cookies = authClient.getCookie();

  const headers = {
    Cookie: cookies,
  } as any;

  // Only add Content-Type if body is provided (not for FormData)
  if (body !== undefined && !formData) {
    headers['Content-Type'] = 'application/json';
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  // Use formData if provided, otherwise use body
  if (formData !== undefined) {
    fetchOptions.body = formData;
  } else if (body !== undefined) {
    fetchOptions.body = body;
  }

  const res = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}${endpoint}`, fetchOptions);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  return data;
}

export async function patchUserImage(asset: ImagePickerAsset) {
  const formData = new FormData();

  formData.append('image', {
    uri: asset.uri,
    type: asset.mimeType || 'image/jpeg',
    name: asset.fileName || 'image.jpg',
  } as any);

  return await serverRequest({
    endpoint: '/users/image',
    method: 'PATCH',
    formData,
  });
}

export async function getPlaces(searchQuery: string, lat: number, lng: number): Promise<Place[]> {
  if (!searchQuery) {
    return [];
  }
  return await serverRequest({
    endpoint: `/places?searchQuery=${searchQuery}&lat=${lat}&lng=${lng}`,
    method: 'GET',
  });
}

export async function getCourts({
  lat,
  lng,
  limit = 25,
  searchQuery,
  indoor,
  verified = true,
  popular,
  bookmarked,
  sortBy,
}: {
  lat: number;
  lng: number;
  limit?: number;
  searchQuery?: string;
  indoor?: boolean;
  verified?: true;
  popular?: true;
  bookmarked?: true;
  sortBy?: 'distance' | 'active_players';
}): Promise<CourtListEntry[]> {
  const params = new URLSearchParams();

  params.append('lat', lat.toString());
  params.append('lng', lng.toString());
  params.append('limit', limit.toString());

  if (searchQuery !== undefined && searchQuery !== '') {
    params.append('searchQuery', searchQuery);
  }
  if (indoor !== undefined) {
    params.append('indoor', indoor.toString());
  }
  if (verified !== undefined) {
    params.append('verified', verified.toString());
  }
  if (popular !== undefined) {
    params.append('popular', popular.toString());
  }
  if (bookmarked !== undefined) {
    params.append('bookmarked', bookmarked.toString());
  }
  if (sortBy !== undefined) {
    params.append('sortBy', sortBy);
  }

  return await serverRequest({
    endpoint: `/courts?${params.toString()}`,
    method: 'GET',
  });
}

export async function getUsers({
  limit = 25,
  searchQuery,
  minHeight,
  maxHeight,
  minOverall,
  sortBy,
}: {
  limit?: number;
  searchQuery?: string;
  minHeight?: string;
  maxHeight?: string;
  minOverall?: number;
  sortBy?: 'most_active' | 'overall_desc' | 'overall_asc';
}): Promise<User[]> {
  const params = new URLSearchParams();

  params.append('limit', limit.toString());

  if (searchQuery !== undefined && searchQuery !== '') {
    params.append('searchQuery', searchQuery);
  }
  if (minHeight !== undefined) {
    params.append('minHeight', minHeight);
  }
  if (maxHeight !== undefined) {
    params.append('maxHeight', maxHeight);
  }
  if (minOverall !== undefined) {
    params.append('minOverall', minOverall.toString());
  }
  if (sortBy !== undefined) {
    params.append('sortBy', sortBy);
  }

  return await serverRequest({
    endpoint: `/users?${params.toString()}`,
    method: 'GET',
  });
}

export async function postCourt({
  place,
  name,
  indoor,
  nickname,
  image: asset,
}: z.infer<typeof AddCourtSchema>) {
  const formData = new FormData();

  formData.append('image', {
    uri: asset.uri,
    type: asset.mimeType || 'image/jpeg',
    name: asset.fileName || 'image.jpg',
  } as any);

  formData.append('name', name);
  formData.append('indoor', indoor.toString());
  formData.append('googlePlaceId', place.id);
  formData.append('address', place.formattedAddress);
  formData.append('lat', place.location.latitude.toString());
  formData.append('lng', place.location.longitude.toString());

  if (nickname) {
    formData.append('aliases', JSON.stringify([nickname]));
  }

  await serverRequest({
    endpoint: '/courts',
    method: 'POST',
    formData,
  });
}

export async function getCourt(
  id: number,
  { lat, lng }: { lat: number; lng: number }
): Promise<Court> {
  const court = await serverRequest({
    endpoint: `/courts/${id}?lat=${lat}&lng=${lng}`,
    method: 'GET',
  });

  return court;
}

export async function getCourtLeaderboard(id: number): Promise<(User & { rank: number })[]> {
  const leaderboard = await serverRequest({
    endpoint: `/courts/${id}/leaderboard`,
    method: 'GET',
  });

  return leaderboard;
}

export async function getCourtActivePlayers(id: number): Promise<User[]> {
  const users = await serverRequest({
    endpoint: `/courts/${id}/active-players`,
    method: 'GET',
  });

  return users;
}

export async function postCourtSession(id: number, coords: { lat: number; lng: number }) {
  await serverRequest({
    endpoint: `/courts/${id}/sessions`,
    method: 'POST',
    body: JSON.stringify(coords),
  });
}

export async function patchCourtSession(id: number) {
  await serverRequest({
    endpoint: `/court-sessions/${id}`,
    method: 'PATCH',
  });
}

export async function getCourtSessions({
  hasRated,
  isActive,
}: {
  hasRated?: boolean;
  isActive?: boolean;
}): Promise<CourtSession> {
  const params = new URLSearchParams();

  if (hasRated !== undefined) {
    params.append('hasRated', hasRated.toString());
  }

  if (isActive !== undefined) {
    params.append('isActive', isActive.toString());
  }

  const courtSession = await serverRequest({
    endpoint: `/court-sessions?${params.toString()}`,
    method: 'GET',
  });

  return courtSession;
}

export async function postCourtBookmark(id: number) {
  await serverRequest({
    endpoint: `/courts/${id}/bookmark`,
    method: 'POST',
  });
}

export async function deleteCourtBookmark(id: number) {
  await serverRequest({
    endpoint: `/courts/${id}/bookmark`,
    method: 'DELETE',
  });
}

export async function getEncounteredPlayers(courtSessionId: number): Promise<EncounteredPlayer[]> {
  return await serverRequest({
    endpoint: `/court-sessions/${courtSessionId}/encountered-players`,
    method: 'GET',
  });
}

export async function patchEncounteredPlayer(
  id: number,
  data: {
    defenseRating?: number;
    finishingRating?: number;
    shootingRating?: number;
    playmakingRating?: number;
    skipped?: boolean;
  }
): Promise<void> {
  await serverRequest({
    endpoint: `/encountered-players/${id}`,
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function postSessionRatings(sessionId: number): Promise<void> {
  await serverRequest({
    endpoint: `/court-sessions/${sessionId}/ratings`,
    method: 'POST',
  });
}

export async function getUser(userId: string): Promise<ExtendedUser> {
  const user = await serverRequest({
    endpoint: `/users/${userId}`,
    method: 'GET',
  });

  return user;
}

export async function getActivity(): Promise<Activity[]> {
  const activityList = await serverRequest({
    endpoint: '/users/activity',
    method: 'GET',
  });

  return activityList;
}

export async function patchExpoPushToken(expoPushToken: string): Promise<void> {
  await serverRequest({
    endpoint: '/users/expoPushToken',
    method: 'PATCH',
    body: JSON.stringify({ expoPushToken }),
  });
}

export async function patchActivityRead(): Promise<void> {
  await serverRequest({
    endpoint: '/users/activity/read',
    method: 'PATCH',
  });
}

export async function postCourtNotification(courtId: number): Promise<void> {
  await serverRequest({
    endpoint: `/courts/${courtId}/notifications`,
    method: 'POST',
  });
}

export async function deleteCourtNotification(courtId: number): Promise<void> {
  await serverRequest({
    endpoint: `/courts/${courtId}/notifications`,
    method: 'DELETE',
  });
}
