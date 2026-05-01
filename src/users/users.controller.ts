import { Body, Controller, Get, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateProfileDto } from './dto/user-dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('/register')
  register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto.email, dto.password);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post("/login")
  login(@Body() dto:CreateUserDto){
    return this.userService.login(dto.email,dto.password)
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    const userId = req.user.sub;
    return this.userService.getProfile(userId);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
  @Patch("/profile")
  @UseInterceptors(FileInterceptor('file')) 
  @UseGuards(JwtAuthGuard) 
  updateProfile(@Req() req, @Body() dto:UpdateProfileDto , @UploadedFile() file?: Express.Multer.File){
    return this.userService.updateProfile(req.user.sub, dto,file);
  }

}  