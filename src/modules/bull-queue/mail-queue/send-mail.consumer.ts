import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SendMailDto } from 'src/modules/mailing/dto/send-mail.dto';
import { MailingServices } from 'src/modules/mailing/mailing.service';
import { MAIL_QUEUE, QUEUE_NAME } from 'src/shared/enums/queue.enum';

@Processor(QUEUE_NAME.MAIL_QUEUE)
export class MailQueueConsumer extends WorkerHost {
  constructor(private readonly mailingServices: MailingServices) {
    super();
  }
  async process({ data, name }: Job<SendMailDto, any, string>): Promise<any> {
    switch (name) {
      case MAIL_QUEUE.SEND:
        this.send(data);
    }
    return {};
  }

  send(data) {
    this.mailingServices.send(data);
  }
}
