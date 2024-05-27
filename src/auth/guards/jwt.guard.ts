import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractBearerTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    //verify the token
    try {
      console.log('helloworld');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECERET_KEY,
      });
      console.log('payload', payload);
      request['user'] = payload;
      console.log(request['user']);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
    return true;
  }
  private extractBearerTokenFromHeader(request: Request) {
    // console.log(request);
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
