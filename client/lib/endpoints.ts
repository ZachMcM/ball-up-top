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
