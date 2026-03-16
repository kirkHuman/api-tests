import { test, expect } from '@playwright/test';
import { ProductsApi } from '../../../common/products.api';

test.describe('Products API @desktop', () => {
  let productsApi: ProductsApi;

  test.beforeEach(({ request }) => {
    productsApi = new ProductsApi(request);
  });

  test('GET /products returns paginated list', async () => {
    const response = await productsApi.getAll({ limit: 10 });

    expect(response.products).toBeDefined();
    expect(Array.isArray(response.products)).toBe(true);
    expect(response.products.length).toBeLessThanOrEqual(10);
    expect(response.total).toBeGreaterThan(0);
    expect(response.skip).toBeDefined();
    expect(response.limit).toBe(10);
    if (response.products.length > 0) {
      expect(response.products[0]).toHaveProperty('id');
      expect(response.products[0]).toHaveProperty('title');
      expect(response.products[0]).toHaveProperty('price');
      expect(response.products[0]).toHaveProperty('category');
    }
  });

  test('GET /products/:id returns single product', async () => {
    const product = await productsApi.getById(1);

    expect(product.id).toBe(1);
    expect(product.title).toBeTruthy();
    expect(typeof product.price).toBe('number');
    expect(product.category).toBeTruthy();
  });

  test('GET /products/search returns matching products', async () => {
    const response = await productsApi.search('phone');

    expect(response.products).toBeDefined();
    expect(response.total).toBeGreaterThanOrEqual(0);
    response.products.forEach((p) => {
      const searchable = `${p.title} ${p.description || ''}`.toLowerCase();
      expect(searchable.includes('phone')).toBe(true);
    });
  });

  test('GET /products/categories returns category list', async () => {
    const categories = await productsApi.getCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    categories.forEach((c) => {
      expect(c).toHaveProperty('slug');
      expect(c).toHaveProperty('name');
      expect(c).toHaveProperty('url');
    });
  });

  test('GET /products/category/:category returns products in category', async () => {
    const response = await productsApi.getByCategory('smartphones');

    expect(response.products).toBeDefined();
    expect(response.total).toBeGreaterThanOrEqual(0);
    response.products.forEach((p) => {
      expect(p.category).toBe('smartphones');
    });
  });

  test('GET /products?sortBy&order returns sorted list', async () => {
    const response = await productsApi.getAll({
      limit: 5,
      sortBy: 'title',
      order: 'asc',
    });

    expect(response.products.length).toBeLessThanOrEqual(5);
    const titles = response.products.map((p) => p.title);
    const sorted = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sorted);
  });

  test('POST /products/add returns created product', async () => {
    const payload = { title: 'BMW Pencil', price: 5.99 };
    const created = await productsApi.add(payload);

    expect(created.id).toBeTruthy();
    expect(created.title).toBe(payload.title);
  });

  test('PUT /products/:id returns updated product', async () => {
    const updated = await productsApi.update(1, { title: 'iPhone Galaxy +1' });

    expect(updated.id).toBe(1);
    expect(updated.title).toBe('iPhone Galaxy +1');
  });

  test('DELETE /products/:id returns deleted product with isDeleted', async () => {
    const deleted = await productsApi.delete(1);

    expect(deleted.id).toBe(1);
    expect(deleted.isDeleted).toBe(true);
    expect(deleted.deletedOn).toBeTruthy();
  });
});
