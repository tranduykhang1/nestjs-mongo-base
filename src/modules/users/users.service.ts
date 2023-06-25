import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-mongoose-plugin';
import { BaseService } from '../../shared/services/base.service';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name) protected userModel: SoftDeleteModel<UserDocument>,
  ) {
    super(userModel);
  }
}
