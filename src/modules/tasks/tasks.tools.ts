import { Injectable } from "@nestjs/common";
import { Tool } from "@nestjs/mcp";
import z from "zod";
import { TasksService } from "./tasks.service.js";

@Injectable()
export class TasksTools {

    constructor(private readonly tasksService: TasksService) {}

    @Tool({
    name: 'find-tasks',
    description:
      'Find tasks using a title or description. If no title or description is provided, all tasks will be returned.',
    inputSchema: z.object({
      title: z.string().optional().describe('The task title'),
      description: z.string().optional().describe('The task description'),
      completed: z.boolean().optional().describe('Filter by completion status'),
    }),
    annotations: { readOnlyHint: true },
  })
  async find({
    title,
    description,
    completed,
  }: {
    title?: string;
    description?: string;
    completed?: boolean;
  }) {
    return this.tasksService.findTasks(title, description, completed);
  }

  @Tool({
    name: 'create-task',
    description: 'Create a new task with a title and optional description.',
    inputSchema: z.object({
      title: z.string().describe('The task title'),
      description: z.string().optional().describe('The task description'),
    }),
  })
  async create({ title, description }: { title: string; description?: string }) {
    return this.tasksService.createTask(title, description);
  }

  @Tool({
    name: 'update-task',
    description:
      'Update an existing task by id. Only the fields provided are changed.',
    inputSchema: z.object({
      id: z.number().int().describe('The id of the task to update'),
      title: z.string().optional().describe('The task title'),
      description: z.string().optional().describe('The task description'),
      completed: z.boolean().optional().describe('The task completion status'),
    }),
  })
  async update({
    id,
    title,
    description,
    completed,
  }: {
    id: number;
    title?: string;
    description?: string;
    completed?: boolean;
  }) {
    return this.tasksService.updateTask(id, title, description, completed);
  }

  @Tool({
    name: 'delete-task',
    description: 'Delete a task by id. This cannot be undone.',
    inputSchema: z.object({
      id: z.number().int().describe('The id of the task to delete'),
    }),
    annotations: { destructiveHint: true },
  })
  async delete({ id }: { id: number }) {
    return this.tasksService.deleteTask(id);
  }
}
