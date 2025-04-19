import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    AuthModule,
     UserModule,
     ConfigModule.forRoot({
      envFilePath:".env",
      isGlobal: true,
    
     }),
     AdminModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
