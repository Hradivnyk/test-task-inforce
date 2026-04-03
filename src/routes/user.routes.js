import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin'), userController.getUsers);

router.get('/:id', authorize('admin'), userController.getUserById);

router.post('/', authorize('admin'), userController.createUser);

router.put('/:id', authorize('admin'), userController.updateUser);

router.delete('/:id', authorize('admin'), userController.deleteUser);

export default router;
