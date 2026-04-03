import mongoose from 'mongoose';
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';

const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid user id', 400);
  }
};

const mapMongooseError = (err) => {
  if (err instanceof AppError) return err;

  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return new AppError(`${field} already in use`, 409);
  }

  if (err?.name === 'ValidationError') {
    return new AppError(err.message || 'User validation error', 400);
  }

  if (err?.name === 'CastError') {
    return new AppError('Invalid user id', 400);
  }

  return err;
};

export const getUsers = async () => {
  const users = await User.find();
  return { users };
};

export const getUserById = async (id) => {
  assertValidId(id);

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
  assertValidId(id);

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
  assertValidId(id);

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError('User not found', 404);

    return { user };
  } catch (err) {
    throw mapMongooseError(err);
  }
};
