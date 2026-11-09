import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma.service.js";

@Injectable()
export class TasksService {

    constructor(private readonly prisma: PrismaService) {}

    getTasks() {
        return this.prisma.task.findMany();
    }

    createTask(title: string, description?: string) {
        return this.prisma.task.create({
            data: {
                title,
                description
            }
        });
    }

    updateTask(id: number, title?: string, description?: string, completed?: boolean) {
        return this.prisma.task.update({
            where: { id },
            data: { title, description, completed }
        });
    }

    deleteTask(id: number) {
        return this.prisma.task.delete({
            where: { id }
        });
    }

    findTasks(title?: string, description?: string, completed?: boolean) {
        const data = this.prisma.task.findMany({
            where: {
                title: title ? { contains: title } : undefined,
                description: description ? { contains: description } : undefined,
                completed,
            }
        });
        return data;
    }

}