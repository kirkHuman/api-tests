import { test, expect } from '@playwright/test';
import { AuthApi } from '../../../common/auth.api';

test.describe('Auth API @desktop', () => {
  let authApi: AuthApi;

  test.beforeEach(({ request }) => {
    authApi = new AuthApi(request);
  });

  test('GET /auth/login with valid credentials returns user and tokens', async () => {
    const response = await authApi.login({
      username: 'emilys',
      password: 'emilyspass',
      expiresInMins: 30,
    });

    expect(response.id).toBe(1);
    expect(response.username).toBe('emilys');
    expect(response.firstName).toBe('Emily');
    expect(response.lastName).toBe('Johnson');
    expect(response.email).toBeTruthy();
    expect(response.accessToken).toBeTruthy();
    expect(response.refreshToken).toBeTruthy();
    expect(typeof response.accessToken).toBe('string');
    expect(typeof response.refreshToken).toBe('string');
  });

  test('GET /auth/me with valid token returns current user', async () => {
    const loginResponse = await authApi.login({
      username: 'emilys',
      password: 'emilyspass',
    });

    const meResponse = await authApi.getMe(loginResponse.accessToken!);

    expect(meResponse.id).toBe(loginResponse.id);
    expect(meResponse.username).toBe(loginResponse.username);
    expect(meResponse.firstName).toBe(loginResponse.firstName);
    expect(meResponse.lastName).toBe(loginResponse.lastName);
    expect(meResponse.email).toBe(loginResponse.email);
  });

  test('POST /auth/refresh returns new tokens', async () => {
    const loginResponse = await authApi.login({
      username: 'emilys',
      password: 'emilyspass',
    });

    const refreshResponse = await authApi.refresh({
      refreshToken: loginResponse.refreshToken,
      expiresInMins: 30,
    });

    expect(refreshResponse.accessToken).toBeTruthy();
    expect(refreshResponse.refreshToken).toBeTruthy();
    expect(typeof refreshResponse.accessToken).toBe('string');
    expect(typeof refreshResponse.refreshToken).toBe('string');
  });
});
