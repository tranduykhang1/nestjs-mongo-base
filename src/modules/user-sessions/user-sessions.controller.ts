import { Controller } from '@nestjs/common';
import { UserSessionsService } from './user-sessions.service';

@Controller('user-sessions')
export class UserSessionsController {
  constructor(private readonly userSessionsService: UserSessionsService) {}
}
