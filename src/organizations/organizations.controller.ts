import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/guards/roles/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateOrganizationDto } from './dto/organization.dto';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}

  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiConsumes('multipart/form-data')
  @Post('/create')
  @UseInterceptors(FileInterceptor('image'))
  createOrganization(
    @Body() dto: CreateOrganizationDto,
    @Req() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // console.log('Full req.user:', req.user);
    const userId = req.user.sub;
    return this.organizationService.createOrganization(dto, userId, file);
  }
}
