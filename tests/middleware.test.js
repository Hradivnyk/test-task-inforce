import request from 'supertest';
import app from '../src/app.js';

// Helper function
const signup = async (role = 'user') => {
  const res = await request(app)
    .post('/api/auth/signup')
    .send({
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      role,
    });
  return res.body.token;
};

// Test authenticate middleware
describe('authenticate middleware', () => {
  it('error - request without token', async () => {
    const res = await request(app).get('/api/books');

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Access denied. No token provided.');
  });

  it('error - invalid token format (without Bearer)', async () => {
    const res = await request(app)
      .get('/api/books')
      .set('Authorization', 'invalid-token');

    expect(res.status).toBe(401);
  });

  it('error - invalid token', async () => {
    const res = await request(app)
      .get('/api/books')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Invalid token.');
  });

  it('successful - valid token allows request', async () => {
    const token = await signup('user');

    const res = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});

// Test authorize middleware
describe('authorize middleware', () => {
  let userToken;
  let adminToken;

  beforeEach(async () => {
    userToken = await signup('user');
    adminToken = await signup('admin');
  });

  it('error - user cannot create book (403)', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Book', author: 'Author', pageCount: 100 });

    expect(res.status).toBe(403);
    expect(res.body.error.message).toContain('Access denied');
  });

  it('successful - admin can create book', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Book', author: 'Author', pageCount: 100 });

    expect(res.status).toBe(201);
  });

  it('error - user cannot get list of users (403)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('successful - admin can get list of users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });
});
