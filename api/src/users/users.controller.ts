import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import type { UpdateProfileDto } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/profile')
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Patch(':id/profile')
  updateProfile(@Param('id') id: string, @Body() payload: UpdateProfileDto) {
    return this.usersService.updateProfile(id, payload);
  }
}
