import catchAsync from '../utils/catchAsync.js';
import * as authService from '../services/auth.service.js';

export const signup = catchAsync(async (req, res) => {
  const { user, token } = await authService.signup(req.body);

  res.status(201).json({
    token,
    user,
  });
});

export const login = catchAsync(async (req, res) => {
  const { user, token } = await authService.login(req.body);

  res.status(200).json({
    token,
    user,
  });
});
