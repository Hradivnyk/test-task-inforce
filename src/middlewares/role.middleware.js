import AppError from '../utils/AppError.js';

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `Access denied. Required role: ${roles.join(' or ')}.`,
        403,
      );
    }
    next();
  };
