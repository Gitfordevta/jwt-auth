import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundError } from 'rxjs';
import { hash, verify } from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(dto: CreateUserDto) {
    //check user exist or not
    const userExist = this.findUserByEmail(dto.email);
    if (userExist) throw new NotFoundException('user already exist');
    // hash the password
    const hashPassword = await hash(dto.password);

    //if not exist create new user

    const createUser = await this.prismaService.user.create({
      data: {
        ...dto,
        password: hashPassword,
      },
    });
    //delet password from object
    delete createUser.password;
    return createUser;
  }
  async findUserByEmail(email: string) {
    try {
      const userExist = await this.prismaService.user.findUnique({
        where: {
          email: email,
        },
      });
      return userExist;
    } catch (error) {
      throw new error(error);
    }
  }

  async findUserById(userId: number) {
    try {
      const userExist = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!userExist) throw new NotFoundException;
      delete userExist.password
      return userExist;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
