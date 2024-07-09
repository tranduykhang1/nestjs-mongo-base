import { Controller } from '@nestjs/common';
import { MailingServices } from './mailing.service';

@Controller('mailing')
export class MailingController {
  constructor(private readonly mailingService: MailingServices) {}
}
