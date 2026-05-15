import { Activity } from '@/types/activity';
import { College, CollegeLeaderboard } from '@/types/college';
import { CourtActivePlayersResponse, CourtResponse, CourtSession } from '@/types/court';
import { EncounteredPlayer } from '@/types/encounteredPlayer';
import { HomeResponse } from '@/types/home';
import { User } from '@/types/user';
import { ImagePickerAsset } from 'expo-image-picker';
import { authClient } from './auth-client';

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

export async function patchUserPrimaryCollege(primaryCollegeId: number) {
  await serverRequest({
    endpoint: '/users/primary-college',
    method: 'PATCH',
    body: JSON.stringify({
      primaryCollegeId,
    }),
  });
}

export async function patchUserName(name: string) {
  await serverRequest({
    endpoint: '/users/name',
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
}

export async function patchUserHeight(height: string) {
  await serverRequest({
    endpoint: '/users/height',
    method: 'PATCH',
    body: JSON.stringify({ height }),
  });
}

export async function patchUserImage(
  asset: ImagePickerAsset,
  options?: { onboardingStep?: 'primaryCollege' }
) {
  const formData = new FormData();

  formData.append('image', {
    uri: asset.uri,
    type: asset.mimeType || 'image/jpeg',
    name: asset.fileName || 'image.jpg',
  } as any);

  if (options?.onboardingStep) {
    formData.append('onboardingStep', options.onboardingStep);
  }

  return await serverRequest({
    endpoint: '/users/image',
    method: 'PATCH',
    formData,
  });
}

export async function getCourt(id: number): Promise<CourtResponse> {
  const court = await serverRequest({
    endpoint: `/courts/${id}`,
    method: 'GET',
  });

  return court;
}

export async function getCollegeLeaderboard(id: number): Promise<CollegeLeaderboard> {
  const leaderboard = await serverRequest({
    endpoint: `/colleges/${id}/leaderboard`,
    method: 'GET',
  });

  return leaderboard;
}

export async function getCourtActivePlayers(
  courtId: number
): Promise<CourtActivePlayersResponse> {
  return await serverRequest({
    endpoint: `/courts/${courtId}/active-players`,
    method: 'GET',
  });
}

export async function getHome(): Promise<HomeResponse> {
  return await serverRequest({
    endpoint: `/home`,
    method: 'GET',
  });
}

export async function getColleges(): Promise<College[]> {
  return await serverRequest({
    endpoint: '/colleges',
    method: 'GET',
  });
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

export async function getUser(userId: string): Promise<User> {
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

export async function getLeaderboard(id: number): Promise<CollegeLeaderboard> {
  const leaderboard = await serverRequest({
    endpoint: `/colleges/${id}/leaderboard`,
    method: 'GET',
  });

  return leaderboard;
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

export async function getUserHasSubmittedRatings(): Promise<{ hasSubmittedRatings: boolean }> {
  return await serverRequest({
    endpoint: `/users/has-submitted-ratings`,
    method: 'GET',
  });
}

export async function patchUserProfile(data: {
  name: string;
  height: string;
  image?: ImagePickerAsset;
}): Promise<{ success: boolean; image?: string }> {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('height', data.height);

  if (data.image) {
    formData.append('image', {
      uri: data.image.uri,
      type: data.image.mimeType || 'image/jpeg',
      name: data.image.fileName || 'image.jpg',
    } as any);
  }

  return await serverRequest({
    endpoint: '/users/profile',
    method: 'PATCH',
    formData,
  });
}
