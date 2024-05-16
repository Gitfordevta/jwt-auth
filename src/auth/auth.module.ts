import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService,UserService,JwtService],
  imports: [PrismaModule],
  controllers: [AuthController],
})
export class AuthModule {}
