import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../shared/services/base.service';
import { User } from './entity/user.entity';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @Inject(UsersRepository) private usersRepository: UsersRepository,
  ) {
    super(usersRepository);
  }
}
