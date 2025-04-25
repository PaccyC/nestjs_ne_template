import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';
import { UserService } from '../user/user.service';

@Module({
  providers: [AuthService,PrismaService,MailService,UserService],
  controllers: [AuthController],
  imports:[JwtModule,MailModule]

})
export class AuthModule {}
