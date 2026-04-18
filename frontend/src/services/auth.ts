const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3000';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json as T;
}

export interface AuthResponse {
  user: { id: string; email: string; displayName: string; timezone: string };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  register(data: { email: string; password: string; displayName: string }) {
    return post<AuthResponse>('/api/auth/register', data);
  },
  login(data: { email: string; password: string }) {
    return post<AuthResponse>('/api/auth/login', data);
  },
};
