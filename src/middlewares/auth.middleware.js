import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import config from '../config/index.js';

export const authenticate = catchAsync(async (req, res, next) => {
  // Get token from headerse
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Access denied. No token provided.', 401);
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>" -> "<token>"

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Token expired. Please login again.', 401);
    }
    throw new AppError('Invalid token.', 401);
  }

  // Check if user exists
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('User no longer exists.', 401);
  }

  // Add user to request
  req.user = user;
  next();
});
