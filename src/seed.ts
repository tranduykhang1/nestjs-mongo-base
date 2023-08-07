import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { seeder } from 'nestjs-seeder';
import { appConfig } from './app.config';
import { User, UserSchema } from './modules/users/entity/user.entity';
import { seeders } from './seeder';

// eslint-disable-next-line @typescript-eslint/no-var-requires
mongoose.plugin(require('mongoose-nanoid'), {
  length: 12,
  alphabets: '1234567890',
});

seeder({
  imports: [
    MongooseModule.forRoot(appConfig.mongoURI),

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
}).run(seeders);
