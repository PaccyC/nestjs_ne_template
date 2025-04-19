import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const tokenValue = authHeader.substring(7);
      try {
        const decodedToken = await this.jwtService.verifyAsync(tokenValue, {
          secret: process.env.JWT_SECRET_KEY,
        });

        const user = await this.prismaService.user.findUnique({
          where: { id: decodedToken.id },
        });

        if (!user) return false;

        request.user = decodedToken;
        return true;
      } catch (error) {
        return false;
      }
    }

    return false; 
  }
}
