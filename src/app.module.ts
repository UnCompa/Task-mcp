import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module.js';
import { ConfigModule } from '@nestjs/config';
import { McpModule } from '@nestjs/mcp';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  McpModule.forRoot({
    name: 'task-manager',
    version: '1.0.0',
    instructions: 'Manage tasks.',
  }), TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
