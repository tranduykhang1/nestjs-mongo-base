import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailingServices {
  logger = new Logger(MailingServices.name);
  constructor(private readonly mailerService: MailerService) {}

  async send(data: SendMailDto): Promise<void> {
    try {
      await this.mailerService.sendMail(data);
      return;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
