import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards, Patch,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ResponseTaskDto } from './dto/response-task.dto';
import { TaskStatus } from './task.entity';

@Controller('tasks')
@UseGuards(RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles('admin', 'director', 'developer', 'tester', 'devOps')
  async create(@Req() req: any, @Body() createTaskDto: CreateTaskDto) {
    await this.taskService.create(createTaskDto, req.user);
    return { success: true, message: 'İşlem başarılı' };
  }

  @Patch(':id/status')
  @Roles('admin', 'director', 'developer')
  async updateStatus(@Param('id') id: number, @Body('status') status: TaskStatus) {
    return this.taskService.updateStatus(id, status)
  }

  @Get('project/:projectId')
  @Roles('admin', 'director', 'developer', 'tester', 'devOps')
  async findAllByProject(
    @Param('projectId') projectId: number,
    @Req() req: any
  ): Promise<ResponseTaskDto[]> {
    return this.taskService.findAllByUserAndProject(Number(projectId));
  }

  @Get()
  @Roles('admin', 'director', 'developer', 'tester', 'devOps')
  async findAll(
    @Req() req: any
  ): Promise<ResponseTaskDto[]> {
    return this.taskService.findAllByUser(req.user);
  }

  @Get('detail/:id')
  @Roles('admin', 'director', 'developer', 'tester', 'devOps')
  async getTaskDetail(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findTaskDetailWithDependencies(id);
  }
}
