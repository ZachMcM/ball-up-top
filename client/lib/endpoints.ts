import { authClient } from "./auth-client";

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

  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, fetchOptions);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  return data;
}
