import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { USER_ROLE } from 'src/shared/enums/user.enum';

export class CreateUserDto {
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty()
  displayName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsEnum(USER_ROLE)
  @ApiProperty()
  role: USER_ROLE;

  @IsOptional()
  @ApiProperty()
  avatar?: string;
}
