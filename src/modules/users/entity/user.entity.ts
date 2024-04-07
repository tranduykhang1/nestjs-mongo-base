import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/shared/entity/base-object.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends BaseEntity {
  @Prop({ minlength: 3, maxlength: 30 })
  @ApiProperty()
  displayName: string;

  @Prop({ unique: true })
  @ApiProperty()
  email: string;

  @Prop()
  @ApiProperty()
  key: string;

  @Prop({ minlength: 6 })
  @ApiProperty()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: function (doc, res) {
    delete res.password;
    delete res.key;
    return res;
  },
});
