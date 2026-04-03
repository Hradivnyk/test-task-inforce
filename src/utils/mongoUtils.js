import mongoose from 'mongoose';
import AppError from './AppError.js';

export const assertValidObjectId = (id, label = 'resource') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${label} id`, 400);
  }
};

export const mapMongooseError = (err) => {
  if (err instanceof AppError) return err;

  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return new AppError(`${field} already in use`, 409);
  }

  if (err?.name === 'ValidationError') {
    return new AppError(err.message || 'Validation error', 400);
  }

  if (err?.name === 'CastError') {
    return new AppError('Invalid id', 400);
  }

  return err;
};
