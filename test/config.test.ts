import mongoose from 'mongoose';

export class ConfigTest {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    mongoose.plugin(require('mongoose-nanoid'), {
      length: 12,
      alphabets: '1234567890',
    });
  }
}
