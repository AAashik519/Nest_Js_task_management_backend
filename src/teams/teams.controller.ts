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
import { TeamsService } from './teams.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTeamDto, UpdateTeamDto, AddTeamMemberDto } from './dto/teams.dto';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamService: TeamsService) {}

  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({
    status: 201,
    description: 'Team created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post('create')
  createTeam(
    @Body() dto: CreateTeamDto,
    @Req() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId=req.user?.sub;
     if (!userId) {
          throw new BadRequestException('Missing user id in request');
        }
    return this.teamService.createTeam(dto,userId,file);
  }


  @ApiOperation({ summary: 'Get all teams by organization' })
  @ApiResponse({
    status: 200,
    description: 'Teams fetched successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get('organization-teams')
  getTeamsByOrganizationId(@Req() req) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new BadRequestException('Missing user id in request');
    }
    return this.teamService.getTeamsByOrganizationId(userId);
  }


  @ApiOperation({ summary: 'Update Teams By teams id' })
  @ApiResponse({
    status: 200,
    description: 'Teams updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @ApiConsumes('multipart/form-data')
  @Patch('organization-teams/:id')
  @UseInterceptors(FileInterceptor('image'))
  updateOrganizationTeamById(@Param('id') id: string, @Req() req, @Body() dto: UpdateTeamDto , @UploadedFile() file?: Express.Multer.File) {

    const userId = req.user?.sub;
    if (!userId) {
      throw new BadRequestException('Missing user id in request');
    }
    return this.teamService.updateOrganizationTeamById(id, userId, dto, file);
  }



  @ApiOperation({ summary: 'Delete Teams By teams id' })
  @ApiResponse({
    status: 200,
    description: 'Teams deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @Delete('organization-teams/:id')
  deleteOrganizationTeamById(@Param('id') id: string, @Req() req) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new BadRequestException('Missing user id in request');
    }
    return this.teamService.deleteOrganizationTeamById(id, userId);
  }

  @ApiOperation({ summary: 'Add member to a team' })
  @ApiResponse({
    status: 201,
    description: 'Team member added successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Team or user not found' })
  @ApiResponse({ status: 409, description: 'User already in team' })
  @Post('organization-teams/:id/members')
  addTeamMember(
    @Param('id') id: string,
    @Body() dto: AddTeamMemberDto,
    @Req() req,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new BadRequestException('Missing user id in request');
    }
    return this.teamService.addTeamMember(id, userId, dto);
  }
}
