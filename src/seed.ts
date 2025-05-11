import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { seeders } from './modules/seeder';
import { User } from './modules/users/entity/user.entity';

seeder({ imports: [TypeOrmModule.forFeature([User])] }).run(seeders);
