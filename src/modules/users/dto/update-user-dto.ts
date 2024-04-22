import {
  ApiHideProperty,
  ApiProperty,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserGender } from 'src/shared/enums/user.enum';
import { CreateUserDto } from './create-user-dto';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['displayName', 'password']),
) {
  @ApiProperty({ enum: UserGender })
  @IsOptional()
  @IsEnum(UserGender)
  gender: UserGender;

  @ApiHideProperty()
  key: string;
}
