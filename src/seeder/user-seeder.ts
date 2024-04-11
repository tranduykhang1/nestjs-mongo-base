import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { User } from '../modules/users/entity/user.entity';
import { Password } from '../utils/password';
import { UserRole } from 'src/shared/enums/user.enum';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async seed(): Promise<any> {
    const items: any[] = [];

    for (let i = 1; i <= 50; i++) {
      const hashData = Password.encrypt('123123123');

      items.push({
        pid: i.toString(),
        displayName: 'User ' + i,
        email: `user${i}@user.com`,
        password: hashData.encryptedData,
        key: hashData.key,
        role: UserRole.USER,
      });
    }

    await this.userModel.insertMany(items);
  }

  async drop(): Promise<any> {
    await this.userModel.deleteMany({});
  }
}
