import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    example: 'This is a organization title',
    description: 'The title of the organization',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'This is a organization description',
    description: 'The description of the organization',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'The image file for the organization (upload as file, not form field)',
  })
  @IsOptional()
  image?: string;
}