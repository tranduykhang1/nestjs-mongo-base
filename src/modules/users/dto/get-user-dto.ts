import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { DefaultQueryDto } from 'src/shared/dto/defaultQuery.dto';
import { UserRole } from 'src/shared/enums/user.enum';

export class GetUserDto extends DefaultQueryDto {
  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty({ enum: UserRole, required: false })
  role?: UserRole;
}
