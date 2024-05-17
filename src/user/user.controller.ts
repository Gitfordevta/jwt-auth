import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Get('profile/:userId')
  async getUserProfile(@Param('userId') userId: number) {
    return this.userService.findUserById(userId)
  }
}
