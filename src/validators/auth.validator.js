import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .trim(),

  email: z
    .email('Invalid email format')
    .trim()
    .transform((value) => value.toLowerCase()),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be at most 100 characters'),

  role: z.enum(['user', 'admin']).default('user').optional(),
});

export const loginSchema = z.object({
  email: z
    .email('Invalid email format')
    .trim()
    .transform((value) => value.toLowerCase()),

  password: z.string({ required_error: 'Password is required' }),
});
