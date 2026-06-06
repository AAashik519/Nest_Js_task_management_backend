import {
    BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
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
import { CreateTeamDto } from './dto/teams.dto';

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
  @ApiConsumes("multipart/form-data'")
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
}
