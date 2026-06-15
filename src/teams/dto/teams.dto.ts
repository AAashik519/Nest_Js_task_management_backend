import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum TeamRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export class CreateTeamDto {
  @ApiProperty({
    example: 'Frontend Team',
    description: 'Name of team',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
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
   @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    image?: string;
 

   @ApiProperty({
    example: '64f1c2a8b6c9e2a1d4e12345',
    description: 'Organization ID under which team will be created',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @IsMongoId()
  organizationId!: string;

}


 export class UpdateTeamDto {
  @ApiPropertyOptional({
    example: 'Frontend Team Updated',
    description: 'Name of team updated',
  })
  @IsOptional()
  @IsString()
  name?: string;
  
  @ApiPropertyOptional({
    example: 'Team Responsible for frontend Development Updated',
    description: 'Description of team updated',
  })
  @IsOptional()
  @IsString()
  description?: string;
  
  @ApiPropertyOptional({
    example: 'https://example.com/team-image.jpg',
    description: 'Image of team updated',
  })
  @IsOptional()
  @IsString()
  image?: string;
 }


export class AddTeamMemberDto {
  @ApiProperty({
    example : 'member@example.com',
    description:
     'The email of the user to add to the team',
     required:true,
  })
  @IsEmail()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email!: string;

  @ApiPropertyOptional({
    enum: TeamRole,
    example: TeamRole.MEMBER,
    description: 'Role of the user to add to the team',
  })
  @IsOptional()
  @IsEnum(TeamRole)
  role?: TeamRole;
 
}