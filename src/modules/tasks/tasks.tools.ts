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
    }),
    annotations: { readOnlyHint: true },
  })
  async find({ title, description }: { title?: string; description?: string }) {
    return this.tasksService.findTasks(title, description);
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
}