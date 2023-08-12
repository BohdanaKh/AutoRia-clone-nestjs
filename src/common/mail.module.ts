import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as dotenv from 'dotenv';
import * as path from 'path';

import { MailService } from './mail/mail.service';

dotenv.config();
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        // host: process.env.EMAIL_HOST,
        // port: +process.env.EMAIL_PORT,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        // secure: false, // Set to true if using SSL
        auth: {
          type: 'login',
          user: 'dananvm@gmail.com',
          pass: 'tdwwxkcuhxgsdbuc',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
      template: {
        dir: path.join(__dirname, '..', '..', '/templates'),
        adapter: new HandlebarsAdapter(),
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
