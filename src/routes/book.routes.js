import { Router } from 'express';
import * as bookController from '../controllers/book.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', bookController.getBooks);

router.get('/:id', bookController.getBookById);

router.post('/', authorize('admin'), bookController.createBook);

router.put('/:id', authorize('admin'), bookController.updateBook);

router.delete('/:id', authorize('admin'), bookController.deleteBook);

export default router;
