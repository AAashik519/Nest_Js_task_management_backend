import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/task-dto';
import { UpdateAssignedTaskDto } from './dto/task-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model, Types } from 'mongoose';
import { uploadToCloudinary } from 'src/utils/cloudinary/cloudinary.utils';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async createTaskService(dto: CreateTaskDto, file?: Express.Multer.File) {
    try {
      let imageUrl = dto.image ?? '';

      if (file) {
        try {
          const result = await uploadToCloudinary(file);
          imageUrl = result.secure_url;
        } catch (error: any) {
          console.error('Cloudinary upload error:', error);
          throw new BadRequestException(
            error?.message || 'Image upload failed',
          );
        }
      }

      const task = await this.taskModel.create({
        ...dto,
        image: imageUrl,
      });

      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'Task Created Successfully',
        data: task,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Task creation failed');
    }
  }

  async getAllTasks(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.status) {
      filter.status = query.status;
    }

    const task = await this.taskModel
      .find(filter)
      .populate('assignTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalTask = await this.taskModel.countDocuments(filter);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Tasks retrieved successfully',
      data: task,
      meta: {
        page,
        limit,
        total: totalTask,
        totalPages: Math.ceil(totalTask / limit),
      },
    };
  }

  async getTaskByID(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid Task Id');
      }
      const task = await this.taskModel.findById(id);

      if (!task) {
        throw new BadRequestException('Task Not found');
      }

      return {
        success: true,
        message: 'Task fetched successfully',
        data: task,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getTaskAndUpdateById(
    id: string,
    dto: CreateTaskDto,
    file?: Express.Multer.File,
  ) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid task id');
      }
      let imageUrl: string | null = null;
      const task = await this.taskModel.findById(id);
      if (!task) {
        throw new NotFoundException('Task Not found');
      }
      if (file) {
        try {
          const result = await uploadToCloudinary(file);
          imageUrl = result.secure_url;
        } catch (error: any) {
          throw new BadRequestException(
            error?.message || 'Image upload failed',
          );
        }
      }
      const updateData = {
        ...dto,
        ...(imageUrl && { image: imageUrl }),
      };

      Object.assign(task, updateData);
      await task.save();

      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Task Updated Successfully',
        data: task,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Task update failed');
    }
  }


  async deleteTaskById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid task id');
      }
      const task = await this.taskModel.findByIdAndDelete(id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }

      return {
        success: true,
        message: 'Task deleted successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
    }
  }

  //users Assign Task

  async getMyTasks(userId: string) {
    try {
      const task = await this.taskModel.find({ assignTo: userId });
      if (!task.length) {
        throw new BadRequestException('Task is not found');
      }
      return {
        success: true,
        message: 'Task fetch successfully',
        data: task,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch assigned tasks');
    }
  }


  //assign user specific task updated
  async updateAssignedTaskById(
    userId: string,
    id: string,
    dto: UpdateAssignedTaskDto,
    file?: Express.Multer.File,
  ) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid task id');
      }

      const task = await this.taskModel.findById(id);

      if (!task) {
        throw new NotFoundException('Task Not found');
      }

      if (String(task.assignTo) !== String(userId)) {
        throw new BadRequestException('You can only update your assigned task');
      }

      let userImageUrl: string | undefined;

      if (file) {
        try {
          const result = await uploadToCloudinary(file);
          userImageUrl = result.secure_url;
        } catch (error: any) {
          throw new BadRequestException(
            error?.message || 'Image upload failed',
          );
        }
      }

      const updateData = {
        ...dto,
        ...(userImageUrl && { userImage: userImageUrl }),
      };

      Object.assign(task, updateData);
      await task.save();

      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Assigned task updated successfully',
        data: task,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Assigned task update failed');
    }
  }
}
