import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.js';
import {
  createUserSchema,
  updateUserSchema,
} from '../validators/user.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin'), userController.getUsers);

router.get('/:id', authorize('admin'), userController.getUserById);

router.post(
  '/',
  authorize('admin'),
  validate(createUserSchema),
  userController.createUser,
);

router.put(
  '/:id',
  authorize('admin'),
  validate(updateUserSchema),
  userController.updateUser,
);

router.delete('/:id', authorize('admin'), userController.deleteUser);

export default router;
