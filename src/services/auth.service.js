import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import { mapMongooseError } from '../utils/mongoUtils.js';
import config from '../config/index.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const signup = async (data) => {
  try {
    const user = await User.create(data);
    const token = generateToken(user._id);

    return { user, token };
  } catch (err) {
    throw mapMongooseError(err);
  }
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError('Invalid email or password', 401);

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) throw new AppError('Invalid email or password', 401);

  const token = generateToken(user._id);

  return { user, token };
};
