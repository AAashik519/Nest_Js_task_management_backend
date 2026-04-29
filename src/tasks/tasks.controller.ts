import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
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
import { UpdateAssignedTaskDto } from './dto/task-dto';

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
    return this.taskService.createTaskService(dto, file);
  }

  @Get('all-tasks')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  getAllTask(@Query() query: any) {
    return this.taskService.getAllTasks(query);
  }

  @Get('task/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  getTaskById(@Param('id') id: string) {
    return this.taskService.getTaskByID(id);
  }

  @Patch('task/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  updateTaskById(
    @Param('id') id: string,
    @Body() dto: CreateTaskDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.taskService.getTaskAndUpdateById(id, dto, file);
  }

  @Patch('my-task/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  updateMyTaskById(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateAssignedTaskDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.taskService.updateAssignedTaskById(
      req.user.sub,
      id,
      dto,
      file,
    );
  }

  @Delete('task/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  deletetaskById(@Param('id') id: string) {
    return this.taskService.deleteTaskById(id);
  }




  @Get("my-task")
  @UseGuards(JwtAuthGuard)
  getMytasks(@Req() req){ 
    return this.taskService.getMyTasks(req.user.sub)
  }
}
