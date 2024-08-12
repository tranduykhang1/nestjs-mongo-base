import { Prop } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity.';

export class BaseDateTrackingEntity extends BaseEntity {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
