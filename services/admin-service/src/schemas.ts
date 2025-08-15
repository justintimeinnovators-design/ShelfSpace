import { z } from 'zod';
import { ModerationAction, ValidationStatus } from '@prisma/client';

export const createModerationLogSchema = z.object({
  action: z.nativeEnum(ModerationAction),
  targetId: z.string(),
  moderatorId: z.string(), // This should come from authenticated user
  reason: z.string().optional(),
});

export const updateBookValidationSchema = z.object({
  status: z.nativeEnum(ValidationStatus),
  validatorId: z.string().optional(), // This should come from authenticated user
  notes: z.string().optional(),
});
