import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/shared/entities/base.entity.';
import { USER_ROLE } from 'src/shared/enums/user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends BaseEntity {
  @Prop({ minlength: 3, maxlength: 30 })
  @ApiProperty()
  firstName: string;

  @Prop({ minlength: 3, maxlength: 30 })
  @ApiProperty()
  lastName: string;

  @Prop({ unique: true })
  @ApiProperty()
  email: string;

  @Prop()
  @ApiProperty()
  key: string;

  @Prop({ minlength: 6 })
  @ApiProperty()
  password: string;

  @Prop({ enum: USER_ROLE, default: USER_ROLE.USER })
  @ApiProperty({ enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE;

  @Prop({ default: null })
  @ApiProperty({ example: new Date() })
  lastActivity: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: function (doc, res) {
    delete res.password;
    delete res.key;
    return res;
  },
});
