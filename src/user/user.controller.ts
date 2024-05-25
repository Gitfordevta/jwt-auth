import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/jwt.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
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
    return this.userService.findUserById(userId);
  }
}
