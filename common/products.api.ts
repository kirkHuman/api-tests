import { BaseApiClient } from './base-api.client';

export interface Product {
  id: number;
  title: string;
  description?: string;
  category?: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  thumbnail?: string;
  images?: string[];
  [key: string]: unknown;
}

export interface ProductsListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface AddProductPayload {
  title: string;
  [key: string]: unknown;
}

export interface DeletedProduct extends Product {
  isDeleted: boolean;
  deletedOn: string;
}

export class ProductsApi extends BaseApiClient {
  async getAll(params?: {
    limit?: number;
    skip?: number;
    select?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<ProductsListResponse> {
    const searchParams: Record<string, string | number> = {};
    if (params?.limit !== undefined) searchParams.limit = params.limit;
    if (params?.skip !== undefined) searchParams.skip = params.skip;
    if (params?.select) searchParams.select = params.select;
    if (params?.sortBy) searchParams.sortBy = params.sortBy;
    if (params?.order) searchParams.order = params.order;
    const query = new URLSearchParams(
      Object.entries(searchParams).map(([k, v]) => [k, String(v)])
    ).toString();
    const path = query ? `/products?${query}` : '/products';
    return this.get<ProductsListResponse>(path);
  }

  async getById(id: number): Promise<Product> {
    return this.get<Product>(`/products/${id}`);
  }

  async search(q: string): Promise<ProductsListResponse> {
    return this.get<ProductsListResponse>(`/products/search?q=${encodeURIComponent(q)}`);
  }

  async getCategories(): Promise<Array<{ slug: string; name: string; url: string }>> {
    return this.get('/products/categories');
  }

  async getCategoryList(): Promise<string[]> {
    return this.get('/products/category-list');
  }

  async getByCategory(category: string): Promise<ProductsListResponse> {
    return this.get<ProductsListResponse>(`/products/category/${category}`);
  }

  async add(payload: AddProductPayload): Promise<Product> {
    return this.post<Product>('/products/add', payload);
  }

  async update(id: number, payload: Partial<Product>): Promise<Product> {
    return this.put<Product>(`/products/${id}`, payload);
  }

  async delete(id: number): Promise<DeletedProduct> {
    return this.deleteRequest<DeletedProduct>(`/products/${id}`);
  }
}
