import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dto/organization.dto';

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
    const userId = req.user?.sub;

    if (!userId) {
      throw new BadRequestException('Missing user id in request');
    }

    return this.organizationService.createOrganization(dto, userId, file);
  }

  @ApiOperation({ summary: 'Owner organizations' })
  @ApiResponse({
    status: 200,
    description: 'Organizations fetched successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @Get('owner-org')
  getOwnerOrganization(@Req() req: any) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new BadRequestException('Missing user id in request');
    }

    return this.organizationService.getOwnerOrganization(userId);
  }

  @ApiOperation({ summary: 'Update Organization' })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @Patch('owner-org/:id')
  @UseInterceptors(FileInterceptor('image'))
  updateOrganization(
    @Body() dto: UpdateOrganizationDto,
    @Req() req: any,
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new BadRequestException('Missing user id in request');
    }

    return this.organizationService.updateOrganization(id, userId, dto, file);
  }

  @ApiOperation({ summary: 'Delete organization' })
  @ApiResponse({
    status: 200,
    description: 'Organization deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @ApiBearerAuth()
  @Delete('/owner-org/:id')
  deleteOrganization(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new BadRequestException('Missing user id in request');
    }

    return this.organizationService.deleteOrganization(id, userId);
  }

  @ApiOperation({ summary: 'Get All Organizations members' })
  @ApiResponse({
    status: 200,
    description: 'Organizations members fetched successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @ApiBearerAuth()
  @Get('/:id/members')
  getOrganizationAllMembers(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new BadRequestException('Missing user id in request');
    }
    return this.organizationService.getOrganizationAllMembers(id, userId);
  }
}
