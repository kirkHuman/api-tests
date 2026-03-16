import { BaseApiClient } from './base-api.client';

export interface LoginPayload {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface RefreshPayload {
  refreshToken?: string;
  expiresInMins?: number;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export class AuthApi extends BaseApiClient {
  async login(payload: LoginPayload): Promise<AuthUser> {
    return this.post<AuthUser>('/auth/login', payload);
  }

  async getMe(accessToken: string): Promise<AuthUser> {
    const response = await this.request.get('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.json() as Promise<AuthUser>;
  }

  async refresh(payload?: RefreshPayload): Promise<RefreshResponse> {
    return this.post<RefreshResponse>('/auth/refresh', payload ?? {});
  }
}
