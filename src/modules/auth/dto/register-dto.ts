import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { LoginDto } from './login-dto';

export class RegisterDto extends LoginDto {
  @IsString()
  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  firstName: string;

  @IsString()
  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiHideProperty()
  key?: string;
}
