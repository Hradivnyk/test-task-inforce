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

const createBook = async (token, data = {}) => {
  const bookData = {
    name: 'Test Book',
    author: 'Test Author',
    pageCount: 200,
    ...data,
  };
  const res = await request(app)
    .post('/api/books')
    .set('Authorization', `Bearer ${token}`)
    .send(bookData);
  return res;
};

describe('GET /api/books', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    adminToken = await signup('admin');
    userToken = await signup('user');
  });

  it('returns empty array when no books exist', async () => {
    const res = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.books).toEqual([]);
  });

  it('returns all books for authenticated user', async () => {
    await createBook(adminToken, { name: 'Book One' });
    await createBook(adminToken, { name: 'Book Two' });

    const res = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.books).toHaveLength(2);
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/books/:id', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    adminToken = await signup('admin');
    userToken = await signup('user');
  });

  it('returns a book by id', async () => {
    const created = await createBook(adminToken, { name: 'My Book' });
    const bookId = created.body.book._id;

    const res = await request(app)
      .get(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.book.name).toBe('My Book');
    expect(res.body.book._id).toBe(bookId);
  });

  it('returns 404 for non-existent id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/books/${fakeId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Book not found');
  });

  it('returns 400 for invalid id format', async () => {
    const res = await request(app)
      .get('/api/books/invalid-id')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Invalid book id');
  });
});

describe('POST /api/books', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    adminToken = await signup('admin');
    userToken = await signup('user');
  });

  it('admin can create a book', async () => {
    const res = await createBook(adminToken, {
      name: 'New Book',
      author: 'Author Name',
      pageCount: 350,
    });

    expect(res.status).toBe(201);
    expect(res.body.book.name).toBe('New Book');
    expect(res.body.book.author).toBe('Author Name');
    expect(res.body.book.pageCount).toBe(350);
    expect(res.body.book._id).toBeDefined();
    expect(res.body.book.createdAt).toBeDefined();
  });

  it('regular user cannot create a book (403)', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Book', author: 'Author', pageCount: 100 });

    expect(res.status).toBe(403);
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ author: 'Author', pageCount: 100 });

    expect(res.status).toBe(400);
  });

  it('returns 400 when author is missing', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Book', pageCount: 100 });

    expect(res.status).toBe(400);
  });

  it('returns 400 when pageCount is missing', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Book', author: 'Author' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when pageCount is less than 1', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Book', author: 'Author', pageCount: 0 });

    expect(res.status).toBe(400);
  });

  it('returns 400 when name exceeds max length', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'A'.repeat(201), author: 'Author', pageCount: 100 });

    expect(res.status).toBe(400);
  });

  it('returns 400 when author is too short', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Book', author: 'A', pageCount: 100 });

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/books/:id', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    adminToken = await signup('admin');
    userToken = await signup('user');
  });

  it('admin can update a book', async () => {
    const created = await createBook(adminToken);
    const bookId = created.body.book._id;

    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Book', pageCount: 500 });

    expect(res.status).toBe(200);
    expect(res.body.book.name).toBe('Updated Book');
    expect(res.body.book.pageCount).toBe(500);
    expect(res.body.book.author).toBe('Test Author');
  });

  it('regular user cannot update a book (403)', async () => {
    const created = await createBook(adminToken);
    const bookId = created.body.book._id;

    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Hacked Book' });

    expect(res.status).toBe(403);
  });

  it('returns 404 for non-existent book', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/books/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'No Book' });

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Book not found');
  });

  it('returns 400 for invalid id', async () => {
    const res = await request(app)
      .put('/api/books/bad-id')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'No Book' });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Invalid book id');
  });

  it('returns 400 for invalid update data', async () => {
    const created = await createBook(adminToken);
    const bookId = created.body.book._id;

    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ pageCount: -5 });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/books/:id', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    adminToken = await signup('admin');
    userToken = await signup('user');
  });

  it('admin can delete a book', async () => {
    const created = await createBook(adminToken);
    const bookId = created.body.book._id;

    const res = await request(app)
      .delete(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.book._id).toBe(bookId);

    const getRes = await request(app)
      .get(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(getRes.status).toBe(404);
  });

  it('regular user cannot delete a book (403)', async () => {
    const created = await createBook(adminToken);
    const bookId = created.body.book._id;

    const res = await request(app)
      .delete(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('returns 404 for non-existent book', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/books/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Book not found');
  });

  it('returns 400 for invalid id', async () => {
    const res = await request(app)
      .delete('/api/books/bad-id')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Invalid book id');
  });
});
