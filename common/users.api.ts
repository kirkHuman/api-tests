import { BaseApiClient } from './base-api.client';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age?: number;
  gender?: string;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
  birthDate?: string;
  image?: string;
  [key: string]: unknown;
}

export interface UsersListResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface AddUserPayload {
  firstName: string;
  lastName: string;
  age?: number;
  [key: string]: unknown;
}

export interface DeletedUser extends User {
  isDeleted: boolean;
  deletedOn: string;
}

export class UsersApi extends BaseApiClient {
  async getAll(params?: { limit?: number; skip?: number; select?: string }): Promise<UsersListResponse> {
    const searchParams: Record<string, string | number> = {};
    if (params?.limit !== undefined) searchParams.limit = params.limit;
    if (params?.skip !== undefined) searchParams.skip = params.skip;
    if (params?.select) searchParams.select = params.select;
    const query = new URLSearchParams(
      Object.entries(searchParams).map(([k, v]) => [k, String(v)])
    ).toString();
    const path = query ? `/users?${query}` : '/users';
    return this.get<UsersListResponse>(path);
  }

  async getById(id: number): Promise<User> {
    return this.get<User>(`/users/${id}`);
  }

  async search(q: string): Promise<UsersListResponse> {
    return this.get<UsersListResponse>(`/users/search?q=${encodeURIComponent(q)}`);
  }

  async filter(key: string, value: string): Promise<UsersListResponse> {
    return this.get<UsersListResponse>(
      `/users/filter?key=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`
    );
  }

  async add(payload: AddUserPayload): Promise<User> {
    return this.post<User>('/users/add', payload);
  }

  async update(id: number, payload: Partial<User>): Promise<User> {
    return this.put<User>(`/users/${id}`, payload);
  }

  async delete(id: number): Promise<DeletedUser> {
    return this.deleteRequest<DeletedUser>(`/users/${id}`);
  }

  async getCartsByUserId(userId: number): Promise<{ carts: unknown[]; total: number; skip: number; limit: number }> {
    return this.get(`/users/${userId}/carts`);
  }

  async getPostsByUserId(userId: number): Promise<{ posts: unknown[]; total: number; skip: number; limit: number }> {
    return this.get(`/users/${userId}/posts`);
  }

  async getTodosByUserId(userId: number): Promise<{ todos: unknown[]; total: number; skip: number; limit: number }> {
    return this.get(`/users/${userId}/todos`);
  }
}
