import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { User, UserDocument } from './entity/user.entity';

export class UsersRepository extends BaseRepository<User> {
  constructor(
    @InjectModel(User.name) protected userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
