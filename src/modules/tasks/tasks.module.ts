import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller,.js";
import { TasksService } from "./tasks.service.js";
import { PrismaService } from "../../shared/prisma.service.js";
import { TasksTools } from "./tasks.tools.js";

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [TasksService, PrismaService, TasksTools],
})
export class TasksModule {}