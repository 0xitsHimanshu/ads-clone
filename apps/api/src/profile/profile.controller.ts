import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.schema';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getProfile(@Req() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Put()
  async updateProfile(@Req() req, @Body() updateDto: Partial<User>) {
    return this.usersService.update(req.user.userId, updateDto);
  }

  @Put('settings')
  async updateSettings(@Req() req, @Body() settingsDto: Partial<User>) {
    return this.usersService.update(req.user.userId, settingsDto);
  }
}
