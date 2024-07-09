import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { appConfig } from 'src/app.config';
import { SendMailDto } from 'src/modules/mailing/dto/send-mail.dto';
import { generateEmailTemplate } from 'src/modules/mailing/templates/registration.template';
import { MAIL_QUEUE, QUEUE_NAME } from 'src/shared/enums/queue.enum';

@Injectable()
export class MailQueueProducer {
  constructor(@InjectQueue(QUEUE_NAME.MAIL_QUEUE) private queue: Queue) {}

  sendRegistration(to: string, verificationKey: string): void {
    const data: SendMailDto = {
      to,
      subject: 'Confirm the new account',
      from: appConfig.supportEmail,
      text: 'Text',
      html: generateEmailTemplate(to, verificationKey),
    };

    this.queue.add(MAIL_QUEUE.SEND, data);
  }
}
