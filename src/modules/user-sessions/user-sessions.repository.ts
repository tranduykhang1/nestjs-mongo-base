import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { Repository } from 'typeorm';
import { UserSession } from './entities/user-session.entity';

export class UserSessionsRepository extends BaseRepository<UserSession> {
  constructor(
    @InjectRepository(UserSession)
    protected readonly userSessionRepository: Repository<UserSession>,
  ) {
    super(userSessionRepository);
  }
}
