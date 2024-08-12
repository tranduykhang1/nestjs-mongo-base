import { Prop } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity.';

export class BaseUserAuditEntity extends BaseEntity {
  @Prop({ default: '' })
  createdBy: string;

  @Prop({ default: '' })
  updatedBy: string;
}
