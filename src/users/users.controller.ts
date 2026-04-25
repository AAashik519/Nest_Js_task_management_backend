import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreatreUserDto } from './dto/user-dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/register')
  register(@Body() dto: CreatreUserDto) {
    return this.userService.register(dto.email, dto.password);
  }

  @Post("/login")
  login(@Body() dto:CreatreUserDto){
    return this.userService.login(dto.email,dto.password)
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    const userId = req.user.sub;
    return this.userService.getProfile(userId);
  }
}