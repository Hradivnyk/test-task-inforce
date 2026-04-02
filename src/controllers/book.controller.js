import catchAsync from '../utils/catchAsync.js';
import * as bookService from '../services/book.service.js';

export const getBooks = catchAsync(async (req, res) => {
  const { books } = await bookService.getBooks(req.body);

  res.status(201).json({
    books,
  });
});

export const getBookById = catchAsync(async (req, res) => {
  const { book } = await bookService.getBookById(req.params.id);

  res.status(200).json({
    book,
  });
});

export const createBook = catchAsync(async (req, res) => {
  const { book } = await bookService.createBook(req.body);

  res.status(201).json({
    book,
  });
});

export const updateBook = catchAsync(async (req, res) => {
  const { book } = await bookService.updateBook(req.params.id, req.body);

  res.status(200).json({
    book,
  });
});

export const deleteBook = catchAsync(async (req, res) => {
  const { book } = await bookService.deleteBook(req.params.id);

  res.status(200).json({
    book,
  });
});
