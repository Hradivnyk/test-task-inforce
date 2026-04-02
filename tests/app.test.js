import request from 'supertest';
import app from '../src/app.js';

describe('GET /', () => {
  it('повертає 200 та повідомлення', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Hello World!' });
  });

  it('повертає JSON', async () => {
    const res = await request(app).get('/');

    expect(res.headers['content-type']).toMatch(/json/);
  });
});

describe('GET /unknown', () => {
  it('повертає 404 для невідомого роуту', async () => {
    const res = await request(app).get('/unknown');

    expect(res.statusCode).toBe(404);
  });
});