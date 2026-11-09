
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(255).optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
