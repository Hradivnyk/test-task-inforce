import { z } from 'zod';

export const createBookSchema = z.object({
  name: z
    .string({ required_error: 'Book name is required' })
    .min(1, 'Name must be at least 1 character')
    .max(200, 'Name must be at most 200 characters')
    .trim(),

  author: z
    .string({ required_error: 'Author is required' })
    .min(2, 'Author must be at least 2 characters')
    .max(100, 'Author must be at most 100 characters')
    .trim(),

  pageCount: z
    .number({ required_error: 'Page count is required' })
    .int('Page count must be an integer')
    .min(1, 'Page count must be at least 1'),
});

export const updateBookSchema = createBookSchema.partial();
