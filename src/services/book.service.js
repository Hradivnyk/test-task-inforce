import Book from '../models/book.model.js';
import { assertValidObjectId, mapMongooseError } from '../utils/mongoUtils.js';
import AppError from '../utils/AppError.js';

export const getBooks = async ({ page = 1, limit = 20 } = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [books, total] = await Promise.all([
    Book.find().skip(skip).limit(limitNum),
    Book.countDocuments(),
  ]);

  return { books, total, page: pageNum, limit: limitNum };
};

export const getBookById = async (id) => {
  assertValidObjectId(id, 'book');

  const book = await Book.findById(id);
  if (!book) throw new AppError('Book not found', 404);

  return { book };
};

export const createBook = async (data) => {
  try {
    const book = await Book.create(data);
    return { book };
  } catch (err) {
    throw mapMongooseError(err);
  }
};

export const updateBook = async (id, data) => {
  assertValidObjectId(id, 'book');

  try {
    const book = await Book.findById(id);
    if (!book) throw new AppError('Book not found', 404);

    book.set(data);
    await book.save();

    return { book };
  } catch (err) {
    throw mapMongooseError(err);
  }
};

export const deleteBook = async (id) => {
  assertValidObjectId(id, 'book');

  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) throw new AppError('Book not found', 404);

    return { book };
  } catch (err) {
    throw mapMongooseError(err);
  }
};
