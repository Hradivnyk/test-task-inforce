import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';

const signup = async (role = 'user') => {
  const res = await request(app)
    .post('/api/auth/signup')
    .send({
      name: 'Test User',
      email: `test-${Date.now()}-${Math.random()}@example.com`,
      password: 'password123',
      role,
    });
  return res.body.token;
};

const createUserViaApi = async (token, data = {}) => {
  const userData = {
    name: 'New User',
    email: `user-${Date.now()}-${Math.random()}@example.com`,
    password: 'securepass123',
    role: 'user',
    ...data,
  };
  const res = await request(app)
    .post('/api/users')
    .set('Authorization', `Bearer ${token}`)
    .send(userData);
  return res;
};

describe('GET /api/users', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    adminToken = await signup('admin');
    userToken = await signup('user');
  });

  it('admin can get list of users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBeGreaterThanOrEqual(1);
  });

  it('regular user cannot get list of users (403)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  it('users do not contain password field', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    for (const user of res.body.users) {
      expect(user.password).toBeUndefined();
    }
  });
});

describe('GET /api/users/:id', () => {
  let adminToken;

  beforeEach(async () => {
    adminToken = await signup('admin');
  });

  it('admin can get user by id', async () => {
    const created = await createUserViaApi(adminToken);
    const userId = created.body.user._id;

    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user._id).toBe(userId);
    expect(res.body.user.name).toBe('New User');
    expect(res.body.user.password).toBeUndefined();
  });

  it('returns 404 for non-existent id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/users/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('User not found');
  });

  it('returns 400 for invalid id format', async () => {
    const res = await request(app)
      .get('/api/users/invalid-id')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Invalid user id');
  });

  it('regular user cannot get user by id (403)', async () => {
    const userToken = await signup('user');
    const created = await createUserViaApi(adminToken);
    const userId = created.body.user._id;

    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });
});

describe('POST /api/users', () => {
  let adminToken;

  beforeEach(async () => {
    adminToken = await signup('admin');
  });

  it('admin can create a user', async () => {
    const res = await createUserViaApi(adminToken, {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      role: 'user',
    });

    expect(res.status).toBe(201);
    expect(res.body.user.name).toBe('Jane Doe');
    expect(res.body.user.email).toBe('jane@example.com');
    expect(res.body.user.role).toBe('user');
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.user._id).toBeDefined();
  });

  it('admin can create another admin', async () => {
    const res = await createUserViaApi(adminToken, {
      name: 'Admin Two',
      email: 'admin2@example.com',
      password: 'password123',
      role: 'admin',
    });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('admin');
  });

  it('returns 409 for duplicate email', async () => {
    const email = 'duplicate@example.com';
    await createUserViaApi(adminToken, { email });

    const res = await createUserViaApi(adminToken, { email });

    expect(res.status).toBe(409);
    expect(res.body.error.message).toBe('email already in use');
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test', password: 'password123' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when password is missing', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test', email: 'test@example.com' });

    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid email format', async () => {
    const res = await createUserViaApi(adminToken, { email: 'not-an-email' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when password is too short', async () => {
    const res = await createUserViaApi(adminToken, { password: '123' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when name is too short', async () => {
    const res = await createUserViaApi(adminToken, { name: 'A' });

    expect(res.status).toBe(400);
  });

  it('regular user cannot create a user (403)', async () => {
    const userToken = await signup('user');
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Hacker',
        email: 'hack@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(403);
  });
});

describe('PUT /api/users/:id', () => {
  let adminToken;

  beforeEach(async () => {
    adminToken = await signup('admin');
  });

  it('admin can update a user', async () => {
    const created = await createUserViaApi(adminToken);
    const userId = created.body.user._id;

    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Name' });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('Updated Name');
    expect(res.body.user._id).toBe(userId);
  });

  it('admin can update user email', async () => {
    const created = await createUserViaApi(adminToken);
    const userId = created.body.user._id;

    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'newemail@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('newemail@example.com');
  });

  it('returns 404 for non-existent user', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/users/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Ghost' });

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('User not found');
  });

  it('returns 400 for invalid id', async () => {
    const res = await request(app)
      .put('/api/users/bad-id')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Ghost' });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Invalid user id');
  });

  it('returns 409 when updating to duplicate email', async () => {
    const email = 'taken@example.com';
    await createUserViaApi(adminToken, { email });

    const second = await createUserViaApi(adminToken);
    const secondId = second.body.user._id;

    const res = await request(app)
      .put(`/api/users/${secondId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email });

    expect(res.status).toBe(409);
    expect(res.body.error.message).toBe('email already in use');
  });

  it('regular user cannot update a user (403)', async () => {
    const userToken = await signup('user');
    const created = await createUserViaApi(adminToken);
    const userId = created.body.user._id;

    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Hacked' });

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/users/:id', () => {
  let adminToken;

  beforeEach(async () => {
    adminToken = await signup('admin');
  });

  it('admin can delete a user', async () => {
    const created = await createUserViaApi(adminToken);
    const userId = created.body.user._id;

    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user._id).toBe(userId);

    const getRes = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(getRes.status).toBe(404);
  });

  it('returns 404 for non-existent user', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/users/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('User not found');
  });

  it('returns 400 for invalid id', async () => {
    const res = await request(app)
      .delete('/api/users/bad-id')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Invalid user id');
  });

  it('regular user cannot delete a user (403)', async () => {
    const userToken = await signup('user');
    const created = await createUserViaApi(adminToken);
    const userId = created.body.user._id;

    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });
});
