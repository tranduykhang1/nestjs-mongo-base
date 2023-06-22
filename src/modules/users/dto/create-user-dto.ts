import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EUserRole } from '../../../shared/enum/user.enum';
import { ELoginMethod } from '../users.enum';

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

  @IsEnum(EUserRole)
  @ApiProperty()
  role: EUserRole;

  @IsOptional()
  @ApiProperty()
  avatar?: string;
}

export class CreateExternalUserDto {
  @MinLength(3)
  @MaxLength(30)
  displayName: string;

  @ApiProperty()
  email: string;

  @IsEnum(EUserRole)
  role: EUserRole;

  @IsString()
  avatar?: string;

  @IsString()
  providerId: string;

  @IsEnum(ELoginMethod)
  loginMethod: ELoginMethod;
}
