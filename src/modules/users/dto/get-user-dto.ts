import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { DefaultListDto } from '../../../shared/dto/default-list-dto';
import { EUserRole } from '../../../shared/enum/user.enum';

export class GetUserDto extends DefaultListDto {
  @IsEnum(EUserRole)
  @IsOptional()
  @ApiProperty({ enum: EUserRole, required: false })
  role?: EUserRole;
}
