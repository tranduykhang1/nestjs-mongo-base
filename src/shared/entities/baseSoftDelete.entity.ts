import { Prop } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity.';

export class BaseSoftDeleteEntity extends BaseEntity {
  @Prop({ default: null })
  deletedAt: Date;

  @Prop({ default: '' })
  deletedBy: string;
}
