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
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Tasks')
@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post('/:teamId/tasks')
  @UseInterceptors(FileInterceptor('image'))
  createTask(
    @Body() dto: CreateTaskDto,
    @Param('teamId') teamId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.taskService.createTaskService(dto,teamId,file);
  }

  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @Get('all-tasks')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  getAllTask(@Query() query: any) {
    return this.taskService.getAllTasks(query);
  }

  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiBearerAuth()
  @Get('task/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  getTaskById(@Param('id') id: string) {
    return this.taskService.getTaskByID(id);
  }

  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
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
    return this.taskService.updateAssignedTaskById(req.user.sub, id, dto, file);
  }

  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiBearerAuth()
  @Delete('task/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  deletetaskById(@Param('id') id: string) {
    return this.taskService.deleteTaskById(id);
  }

  @Get('my-task')
  @UseGuards(JwtAuthGuard)
  getMytasks(@Req() req) {
    return this.taskService.getMyTasks(req.user.sub);
  }
}
