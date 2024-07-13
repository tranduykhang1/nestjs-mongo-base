import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export class MongoMemoryTestModule {
  static async createMongooseTestModule() {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    return {
      module: MongoMemoryTestModule,
      imports: [MongooseModule.forRoot(uri)],
      providers: [],
      exports: [],
      global: true,
    };
  }
}
