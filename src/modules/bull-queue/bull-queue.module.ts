import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { appConfig } from 'src/app.config';
import { QUEUE_NAME } from 'src/shared/enums/queue.enum';
import { BullQueueController } from './bull-queue.controller';
import { BullQueueService } from './bull-queue.service';
import { MailQueueProducer } from './mail-queue/mail-queue.producer';
import { MailQueueConsumer } from './mail-queue/send-mail.consumer';
import { MailingModule } from '../mailing/mailing.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: appConfig.redisHost,
        port: +appConfig.redisPort,
        password: appConfig.redisPass,
      },
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME.MAIL_QUEUE,
    }),
    MailingModule,
  ],
  controllers: [BullQueueController],
  providers: [BullQueueService, MailQueueProducer, MailQueueConsumer],
  exports: [MailQueueProducer],
})
export class BullQueueModule {}
