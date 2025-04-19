import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AdminService,PrismaService],
  controllers: [AdminController],
  imports:[JwtModule]
})
export class AdminModule {}
