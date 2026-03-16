import { test, expect } from '@playwright/test';
import { UsersApi } from '../../common/users.api';

test.describe('Users API @desktop', () => {
  let usersApi: UsersApi;

  test.beforeEach(({ request }) => {
    usersApi = new UsersApi(request);
  });

  test('GET /users returns paginated list', async () => {
    const response = await usersApi.getAll({ limit: 10, skip: 0 });

    expect(response.users).toBeDefined();
    expect(Array.isArray(response.users)).toBe(true);
    expect(response.users.length).toBeLessThanOrEqual(10);
    expect(response.total).toBeGreaterThan(0);
    expect(response.skip).toBe(0);
    expect(response.limit).toBe(10);
    if (response.users.length > 0) {
      expect(response.users[0]).toHaveProperty('id');
      expect(response.users[0]).toHaveProperty('firstName');
      expect(response.users[0]).toHaveProperty('lastName');
      expect(response.users[0]).toHaveProperty('email');
    }
  });

  test('GET /users/:id returns single user', async () => {
    const user = await usersApi.getById(1);

    expect(user.id).toBe(1);
    expect(user.firstName).toBe('Emily');
    expect(user.lastName).toBe('Johnson');
    expect(user.username).toBe('emilys');
    expect(user.email).toBeTruthy();
  });

  test('GET /users?limit&skip pagination works', async () => {
    const first = await usersApi.getAll({ limit: 5, skip: 0 });
    const second = await usersApi.getAll({ limit: 5, skip: 5 });

    expect(first.users.length).toBeLessThanOrEqual(5);
    expect(second.users.length).toBeLessThanOrEqual(5);
    if (first.users.length > 0 && second.users.length > 0) {
      expect(first.users[0].id).not.toBe(second.users[0].id);
    }
  });

  test('GET /users/search returns matching users', async () => {
    const response = await usersApi.search('John');

    expect(response.users).toBeDefined();
    expect(response.total).toBeGreaterThanOrEqual(0);
    response.users.forEach((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      expect(fullName.includes('john') || u.lastName?.toLowerCase().includes('john')).toBe(true);
    });
  });

  test('POST /users/add returns created user with id', async () => {
    const payload = {
      firstName: 'Test',
      lastName: 'User',
      age: 30,
    };
    const created = await usersApi.add(payload);

    expect(created.id).toBeTruthy();
    expect(created.firstName).toBe(payload.firstName);
    expect(created.lastName).toBe(payload.lastName);
    expect(created.age).toBe(payload.age);
  });

  test('PUT /users/:id returns updated user', async () => {
    const updated = await usersApi.update(2, { lastName: 'Owais' });

    expect(updated.id).toBe(2);
    expect(updated.lastName).toBe('Owais');
  });

  test('DELETE /users/:id returns deleted user with isDeleted', async () => {
    const deleted = await usersApi.delete(1);

    expect(deleted.id).toBe(1);
    expect(deleted.isDeleted).toBe(true);
    expect(deleted.deletedOn).toBeTruthy();
  });

  test('GET /users/:id/carts returns user carts', async () => {
    const response = await usersApi.getCartsByUserId(6);

    expect(response).toHaveProperty('carts');
    expect(Array.isArray(response.carts)).toBe(true);
    expect(response).toHaveProperty('total');
  });
});
