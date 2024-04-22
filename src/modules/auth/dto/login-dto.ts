import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'User email', example: 'johndoe@example.com' })
  @IsString()
  @IsEmail()
  email: string;

  @MinLength(6)
  @MaxLength(18)
  @ApiProperty({ description: 'User password', example: 'johndoe123' })
  password: string;
}
