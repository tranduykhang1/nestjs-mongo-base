import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

export class UsersRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}
