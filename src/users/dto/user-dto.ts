import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: "user@example.com",
    description: 'The email of the user',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: "password123",
    description: 'The password of the user (minimum 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({
    example: "John Doe",
    description: 'The name of the user',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: "+1234567890",
    description: 'The phone number of the user',
  })
  @IsOptional()
  @IsString()
  number?: string;
 
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: "John Doe",
    description: 'The name of the user',
  })
  @IsOptional()
  @IsString()
  name?: string;


  @ApiPropertyOptional({
    example: "+1234567890",
    description: 'The phone number of the user',
  })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiPropertyOptional({
    example: "https://example.com/profile.jpg",
    description: 'The profile image URL of the user',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: "2023-01-01",
    description: 'The date of the user',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;
}
