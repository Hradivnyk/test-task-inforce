import request from 'supertest';
import app from '../src/app.js';

describe('POST /api/auth/signup', () => {
  const validUser = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  it('successful registration — returns 201 and token', async () => {
    const res = await request(app).post('/api/auth/signup').send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(validUser.email);
    expect(res.body.user.password).toBeUndefined(); // password is not returned
  });

  it('error — email already exists', async () => {
    await request(app).post('/api/auth/signup').send(validUser);

    const res = await request(app).post('/api/auth/signup').send(validUser);

    expect(res.status).toBe(409);
    expect(res.body.error.message).toBe('Email already in use');
  });

  it('error — invalid data', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'bad-email', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/signup').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
  });

  it('successful login — returns 200 and token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('error — incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Invalid email or password');
  });

  it('error — email does not exist', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });

    expect(res.status).toBe(401);
  });
});
