import { Router } from 'express';
import * as bookController from '../controllers/book.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.js';
import {
  createBookSchema,
  updateBookSchema,
} from '../validators/book.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', bookController.getBooks);

router.get('/:id', bookController.getBookById);

router.post(
  '/',
  authorize('admin'),
  validate(createBookSchema),
  bookController.createBook,
);

router.put(
  '/:id',
  authorize('admin'),
  validate(updateBookSchema),
  bookController.updateBook,
);

router.delete('/:id', authorize('admin'), bookController.deleteBook);

export default router;
