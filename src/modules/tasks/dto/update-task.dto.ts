
import { z } from 'zod';

export const updateTaskSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(255).optional(),
  completed: z.boolean().optional(),
});

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
