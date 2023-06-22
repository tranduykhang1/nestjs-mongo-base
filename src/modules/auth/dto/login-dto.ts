import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'LoginID', example: 'admin_1' })
  @IsString()
  loginId: string;

  @MinLength(6)
  @MaxLength(18)
  @ApiProperty({ description: 'User password', example: '123123123' })
  password: string;
}
