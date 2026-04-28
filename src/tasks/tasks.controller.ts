import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/task-dto';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/common/guards/roles/roles.decorator';
import { RoleGuard } from 'src/common/guards/roles/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  createTask(
    @Body() dto: CreateTaskDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.taskService.createTaskService(dto,file);
  }


  @Get("all-tasks")
  @UseGuards(JwtAuthGuard,RoleGuard)
  @Roles("admin")
  getAllTask(@Query() query :any){
    return this.taskService.getAllTasks(query)
  }
}
