import { ImagePickerAsset } from 'expo-image-picker';
import { authClient } from './auth-client';
import { Court, Place } from '@/types/court';
import * as z from 'zod';
import { AddCourtSchema } from '@/app/add-court';

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
  verified,
}: {
  lat: number;
  lng: number;
  limit?: number;
  searchQuery?: string;
  indoor?: boolean;
  verified?: boolean;
}): Promise<Court[]> {
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

  return await serverRequest({
    endpoint: `/courts?${params.toString()}`,
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
