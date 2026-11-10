
import { z } from 'zod';

// Route params arrive as strings; coerce to the integer id Prisma expects.
export const taskIdSchema = z.coerce.number().int().positive();

export type TaskIdDto = z.infer<typeof taskIdSchema>;
