import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { LoginDto } from './login-dto';

export class RegisterDto extends LoginDto {
  @IsString()
  @ApiProperty({
    description: 'New user displayName',
    example: 'User name',
  })
  displayName: string;

  @ApiHideProperty()
  key?: string;
}
