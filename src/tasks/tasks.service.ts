import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/task-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model } from 'mongoose';
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
}
