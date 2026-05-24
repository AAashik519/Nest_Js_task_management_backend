import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsMongoId,
  IsEmail,
  IsEnum,
  MinLength,
} from 'class-validator';
import { OrgRole } from 'src/utils/EmunsData';

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
    description:
      'The image file for the organization (upload as file, not form field)',
  })
  @IsOptional()
  image?: string;
}

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ description: 'The title of the organization' })
  @IsString()
  @IsOptional()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ description: 'The description of the organization' })
  @IsString()
  @IsOptional()
  @MinLength(5)
  description?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description:
      'The new image file for the organization (upload as file, not form field)',
  })
  @IsOptional()
  image?: string;
}

export class CreateOrgMemberDto {
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'The ID of the user to be added as a member',
  })
  @IsMongoId()
  userId!: string;

  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'The ID of the organization to which the user will be added',
  })
  @IsMongoId()
  organizationId!: string;

  @ApiProperty({
    example: 'MEMBER',
    description: 'The role of the user in the organization',
  })
  @IsString()
  @IsNotEmpty()
  role!: string;
}

export class AddOrganizationMemberDto {
  @ApiProperty({
    example: 'member@example.com',
    description: 'Email of the user to add to this organization',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    enum:OrgRole,
    example:OrgRole.MEMBER,
    description:"Role to assign to the user (OWNER is not allowed here)"
  })
 
  @IsOptional()
  @IsEnum(OrgRole)
  role?: OrgRole;

}
