import { APIRequestContext } from '@playwright/test';

export abstract class BaseApiClient {
  constructor(protected readonly request: APIRequestContext) {}

  protected async get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
    const search = params
      ? '?' + new URLSearchParams(Object.fromEntries(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        )).toString()
      : '';
    const response = await this.request.get(path + search);
    return response.json() as Promise<T>;
  }

  protected async post<T>(path: string, data?: object): Promise<T> {
    const response = await this.request.post(path, { data });
    return response.json() as Promise<T>;
  }

  protected async put<T>(path: string, data?: object): Promise<T> {
    const response = await this.request.put(path, { data });
    return response.json() as Promise<T>;
  }

  protected async patch<T>(path: string, data?: object): Promise<T> {
    const response = await this.request.patch(path, { data });
    return response.json() as Promise<T>;
  }

  protected async deleteRequest<T>(path: string): Promise<T> {
    const response = await this.request.delete(path);
    return response.json() as Promise<T>;
  }
}
