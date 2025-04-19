import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [
    UserService,
    PrismaService,
  ],
  controllers: [UserController],
  imports:[JwtModule]
})
export class UserModule {}
