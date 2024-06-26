import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class BaseEntity {
  _id: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: '' })
  createdBy: string;

  @Prop({ default: '' })
  updatedBy: string;

  @Prop({ default: null })
  deletedAt: Date;

  @Prop({ default: '' })
  deletedBy: string;

  @Prop({ default: false })
  isDeleted: boolean;
}
