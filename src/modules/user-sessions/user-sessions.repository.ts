import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import {
  UserSession,
  UserSessionDocument,
} from './entities/user-session.entity';

export class UserSessionsRepository extends BaseRepository<UserSession> {
  constructor(
    @InjectModel(UserSession.name)
    protected userModel: Model<UserSessionDocument>,
  ) {
    super(userModel);
  }
}
