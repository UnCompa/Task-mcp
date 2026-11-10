import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TasksService } from "./tasks.service.js";
import { type CreateTaskDto, createTaskSchema } from "./dto/create-task.dto.js";
import { updateTaskSchema, type UpdateTaskDto } from "./dto/update-task.dto.js";
import { taskIdSchema } from "./dto/task-id.dto.js";

@Controller("tasks")
export class TasksController {

    constructor(private readonly tasksService: TasksService) {}


    @Get()
    getTasks() {
        return this.tasksService.getTasks();
    }

    @Post()
    createTask(@Body({schema: createTaskSchema}) { title, description }: CreateTaskDto) {
        return this.tasksService.createTask(title, description);
    }

    @Put(":id")
    updateTask(@Param("id", { schema: taskIdSchema }) id: number, @Body({schema: updateTaskSchema}) { title, description, completed }: UpdateTaskDto) {
        return this.tasksService.updateTask(id, title, description, completed);
    }

    @Delete(":id")
    deleteTask(@Param("id", { schema: taskIdSchema }) id: number) {
        return this.tasksService.deleteTask(id);
    }

}