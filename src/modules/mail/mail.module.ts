import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"

@Module({
  
  providers: [MailService],
  exports:[MailService],
  imports:[
    MailerModule.forRoot({
      transport:{
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth:{
          user:process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      },
      defaults:{
        from: '"APPIO" <no-reply@appio.com> '
      },
      template:{
        dir: join(process.cwd(), 'src/modules/mail/templates'),
        adapter:  new HandlebarsAdapter,
        options:{
          strict: true
        }
      }
     })
  ]
})
export class MailModule {}
