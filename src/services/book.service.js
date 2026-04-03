import mongoose from 'mongoose';
import Book from '../models/book.model.js';
import AppError from '../utils/AppError.js';

const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid book id', 400);
  }
};

const mapMongooseError = (err) => {
  if (err?.name === 'ValidationError') {
    return new AppError(err.message || 'Book validation error', 400);
  }

  if (err?.name === 'CastError') {
    return new AppError('Invalid book id', 400);
  }

  return err;
};

export const getBooks = async () => {
  const books = await Book.find();
  return { books };
};

export const getBookById = async (id) => {
  assertValidId(id);

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
  assertValidId(id);

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
  assertValidId(id);

  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) throw new AppError('Book not found', 404);

    return { book };
  } catch (err) {
    throw mapMongooseError(err);
  }
};
