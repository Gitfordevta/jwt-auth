import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, verify } from 'argon2';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async register(dto: AuthDto) {
    //check user if user not exist throw error credentials not matched
    const checkUser = await this.userService.findUserByEmail(dto.email);
    //hash the password
    const hashPassword = await hash(dto.password);
    console.log(checkUser);
    //if user exist then register the user
    if (checkUser) throw new ConflictException('Invalid Credentials');
    const registerUser = this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashPassword,
      },
    });
    delete (await registerUser).password;
    return registerUser;
  }

  async login(dto: AuthDto) {
    try {
      const user = await this.validateUser(dto);
      const payload = {
        username: user.email,
        sub: {
          name: user.name,
        },
      };
      return {
        user,
        backendToken: {
          accessToken: await this.jwtService.signAsync(payload, {
            expiresIn: '20s',
            secret: process.env.JWT_SECERET_KEY,
          }),
          refreshToken: await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            secret: process.env.JWT_REFERESH_KEY,
          }),
        },
      };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
  async validateUser(dto: AuthDto) {
    //check if user exist
    const checkUser = await this.userService.findUserByEmail(dto.email);

    //if user exist and password matched
    if (checkUser && (await verify(checkUser.password, dto.password))) {
      delete checkUser.password;
      return checkUser;
    }
    throw new UnauthorizedException('Invalid Credentials');
  }
  async refreshToken(user: any) {
    const payload = {
      username: user.username,
      sub: user.sub,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '20s',
        secret: process.env.JWT_SECERET_KEY,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFERESH_KEY,
      }),
    };
  }
}
