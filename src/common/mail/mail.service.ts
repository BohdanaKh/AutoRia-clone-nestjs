import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(
    to: string,
    subject: string,
    template: string,
    context: NonNullable<unknown>,
  ): Promise<SentMessageInfo> {
    return await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }
}
