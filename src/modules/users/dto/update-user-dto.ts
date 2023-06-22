import {
  ApiHideProperty,
  ApiProperty,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EUserGender } from 'src/shared/enum/user.enum';
import { CreateUserDto } from './create-user-dto';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['displayName', 'password']),
) {
  @ApiProperty({ enum: EUserGender })
  @IsOptional()
  @IsEnum(EUserGender)
  gender: EUserGender;

  @ApiHideProperty()
  key: string;
}
