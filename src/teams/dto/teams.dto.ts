import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({
    example: 'Frontend Team',
    description: 'Name of team',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example:"Team Responsible for frontend Development",
    required:false,
  })
  @IsOptional()
  @IsString()
  description?:string

  @ApiPropertyOptional({
     type: 'string',
    format: 'binary',
    description:
      'The image file for the organization (upload as file, not form field)',
  })
   @IsOptional()
    image?: string;
 

   @ApiProperty({
    example: '64f1c2a8b6c9e2a1d4e12345',
    description: 'Organization ID under which team will be created',
  })
  @IsNotEmpty()
  @IsMongoId()
  organizationId!: string;

}
