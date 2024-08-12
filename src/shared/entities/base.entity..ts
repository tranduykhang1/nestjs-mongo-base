import { Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class BaseEntity {
  _id: string;
}
