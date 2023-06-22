import mongoose from 'mongoose';
import { SoftDelete } from 'soft-delete-mongoose-plugin';

export class ConfigTest {
  constructor() {
    mongoose.plugin(require('mongoose-nanoid'), {
      length: 12,
      alphabets: '1234567890',
    });
    mongoose.plugin(
      new SoftDelete({
        isDeletedField: 'isDeleted',
        deletedAtField: 'deletedAt',
      }).getPlugin(),
    );
  }
}
