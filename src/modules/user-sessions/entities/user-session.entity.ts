import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/entity/user.entity';
import { BaseEntity } from 'src/shared/entities/base.entity.';

export type UserSessionDocument = HydratedDocument<UserSession>;

@Schema({ timestamps: true, collection: 'user-sessions' })
export class UserSession extends BaseEntity {
  @ApiProperty({ type: String })
  @Prop({ required: true, ref: User.name, type: String })
  userId: string;

  @ApiProperty({ type: String })
  @Prop({ required: true, unique: true, default: Date.now() })
  session: string;

  @ApiProperty({ type: Boolean })
  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  refreshToken: string;

  @ApiProperty({ type: User })
  user?: User;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);

UserSessionSchema.index({ userId: 1 }, { unique: true });
UserSessionSchema.index({ email: 1 }, { unique: true });
