import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { appConfig } from 'src/app.config';
import { MailingController } from './mailing.controller';
import { MailingServices } from './mailing.service';

@Module({
  imports: [
    MailerModule.forRoot({
      // transport: `smtps://${appConfig.supportEmail}:${appConfig.supportEmailPw}@smtp.gmail.email`,
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: appConfig.supportEmail,
          pass: appConfig.supportEmailPw,
        },
      },
      defaults: {
        from: `"No Reply" <${appConfig.supportEmail}>`,
      },
    }),
  ],
  controllers: [MailingController],
  providers: [MailingServices],
  exports: [MailingServices],
})
export class MailingModule {}
