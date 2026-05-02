import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from 'src/utils/EmunsData';

export class CreateTaskDto {
  @ApiProperty({
    example: 'This is a task title',
    description: 'The title of the task',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'This is a task description',
    description: 'The description of the task',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'The image associated with the task',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: 'user123',
    description: 'The user to whom the task is assigned',
  })
  @IsOptional()
  @IsString()
  assignTo?: string;

  @ApiPropertyOptional({
    example: '2023-12-31T23:59:59.000Z',
    description: 'The deadline for the task',
  })
  @IsOptional()
  deadline?: Date;

  @ApiPropertyOptional({
    example: 'pending',
    description: 'The status of the task',
    enum: TaskStatus,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    example: 'This is a user description',
    description: 'The description provided by the user',
  })
  @IsOptional()
  @IsString()
  userDescription?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/user-image.jpg',
    description: 'The image associated with the user',
  })
  @IsOptional()
  @IsString()
  userImage?: string;
}

export class UpdateAssignedTaskDto {
  @ApiProperty({
    example: 'pending',
    description: 'The status of the task',
    enum: TaskStatus,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    example: 'This is a user description',
    description: 'The description provided by the user',
  })
  @IsOptional()
  @IsString()
  userDescription?: string;
  

  @ApiProperty({
    example: 'https://example.com/user-image.jpg',
    description: 'The image associated with the user',
  })
  @IsOptional()
  @IsString()
  userImage?: string;
}
