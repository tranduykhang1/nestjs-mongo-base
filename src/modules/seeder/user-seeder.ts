import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { USER_ROLE } from 'src/shared/enums/user.enum';
import { Password } from 'src/utils/password';
import { User } from '../users/entity/user.entity';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed(): Promise<any> {
    const items: Partial<User>[] = [];

    for (let i = 1; i <= 50; i++) {
      const hashData = Password.encrypt('123123123');

      items.push({
        firstName: 'User',
        lastName: i.toString(),
        email: `user${i}@user.com`,
        password: hashData.encryptedData,
        key: hashData.key,
        role: USER_ROLE.USER,
      });
    }

    const userRepository = this.dataSource.getRepository(User);
    await userRepository.save(items);
  }

  async drop(): Promise<any> {
    const userRepository = this.dataSource.getRepository(User);
    await userRepository.clear();
  }
}
