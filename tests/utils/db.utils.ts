import mongoose, { FilterQuery } from 'mongoose';

export class TestDbUtils {
  private readonly mongoUri =
    'mongodb://superadmin:secret-admin-string@localhost:27019/example?authSource=admin';

  private conn: mongoose.Connection;

  constructor() {
    this.conn = mongoose.createConnection(this.mongoUri, {});
  }

  async cleanup<T extends Document>(
    filter: FilterQuery<T>,
    modelName: string,
  ): Promise<void> {
    try {
      console.log(modelName);
      await this.conn.collection(modelName).deleteMany(filter as any);
      this.conn.close();
      return;
    } catch (err) {
      console.log(err);
    }
  }
}
