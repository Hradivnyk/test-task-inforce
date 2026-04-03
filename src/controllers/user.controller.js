import catchAsync from '../utils/catchAsync.js';
import * as userService from '../services/user.service.js';

export const getUsers = catchAsync(async (req, res) => {
  const { users } = await userService.getUsers(req.body);

  res.status(200).json({
    users,
  });
});

export const getUserById = catchAsync(async (req, res) => {
  const { user } = await userService.getUserById(req.params.id);

  res.status(200).json({
    user,
  });
});

export const createUser = catchAsync(async (req, res) => {
  const { user } = await userService.createUser(req.body);

  res.status(201).json({
    user,
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const { user } = await userService.updateUser(req.params.id, req.body);

  res.status(200).json({
    user,
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  const { user } = await userService.deleteUser(req.params.id);

  res.status(200).json({
    user,
  });
});
