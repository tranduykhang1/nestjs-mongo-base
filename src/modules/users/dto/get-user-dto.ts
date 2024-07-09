import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { DefaultQueryDto } from 'src/shared/dto/defaultQuery.dto';
import { USER_ROLE } from 'src/shared/enums/user.enum';

export class GetUserDto extends DefaultQueryDto {
  @IsEnum(USER_ROLE)
  @IsOptional()
  @ApiProperty({ enum: USER_ROLE, required: false })
  role?: USER_ROLE;
}
