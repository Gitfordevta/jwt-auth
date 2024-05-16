import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() dto: AuthDto) {
    return await this.authService.register(dto);
  }
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }
}
