import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class DatabaseService<T> {
  constructor(private readonly model: Model<T>) {}

  async clearDatabase(): Promise<void> {
    try {
      await this.model.deleteMany({});
      console.log('Database cleared successfully.');
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  }
}
