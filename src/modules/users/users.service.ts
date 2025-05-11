import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../shared/services/base.service';
import { User } from './entity/user.entity';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private usersRepository: UsersRepository,
  ) {
    super(usersRepository);
  }
}
