import { z } from 'zod';

export const createMessageSchema = z.object({
  groupId: z.string(),
  content: z.string().min(1),
});
