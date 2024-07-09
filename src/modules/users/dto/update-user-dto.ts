import {
  ApiHideProperty,
  ApiProperty,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { USER_GENDER } from 'src/shared/enums/user.enum';
import { CreateUserDto } from './create-user-dto';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['displayName', 'password']),
) {
  @ApiProperty({ enum: USER_GENDER })
  @IsOptional()
  @IsEnum(USER_GENDER)
  gender: USER_GENDER;

  @ApiHideProperty()
  key: string;
}
