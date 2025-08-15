import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(255).optional(),
});

export const updateGroupSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  description: z.string().max(255).optional(),
});
