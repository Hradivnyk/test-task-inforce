import User from '../models/user.model.js';
import { assertValidObjectId, mapMongooseError } from '../utils/mongoUtils.js';
import AppError from '../utils/AppError.js';

export const getUsers = async ({ page = 1, limit = 20 } = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limitNum),
    User.countDocuments(),
  ]);

  return { users, total, page: pageNum, limit: limitNum };
};

export const getUserById = async (id) => {
  assertValidObjectId(id, 'user');

  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404);

  return { user };
};

export const createUser = async (data) => {
  try {
    const user = await User.create(data);
    return { user };
  } catch (err) {
    throw mapMongooseError(err);
  }
};

export const updateUser = async (id, data) => {
  assertValidObjectId(id, 'user');

  try {
    const user = await User.findById(id).select('+password');
    if (!user) throw new AppError('User not found', 404);

    user.set(data);
    await user.save();

    return { user };
  } catch (err) {
    throw mapMongooseError(err);
  }
};

export const deleteUser = async (id) => {
  assertValidObjectId(id, 'user');

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError('User not found', 404);

    return { user };
  } catch (err) {
    throw mapMongooseError(err);
  }
};
