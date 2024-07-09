import { TestBed } from '@automock/jest';
import { MailerService } from '@nestjs-modules/mailer';
import { MailingServices } from '../mailing.service';

describe('MailingService', () => {
  let service: MailingServices, mailerService: jest.Mocked<MailerService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(MailingServices).compile();
    service = unit;
    mailerService = unitRef.get(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mailerService).toBeDefined();
  });
});
