import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EUserRole } from '../../shared/enum/user.enum';
import { AuthRoles } from '../auth/decorators/auth-role.decorator';
import { UsersService } from './users.service';

@ApiTags('USER')
@ApiBearerAuth()
@Controller('users')
@AuthRoles(EUserRole.ADMIN, EUserRole.SUPER_ADMIN)
export class UsersController {
  constructor(private readonly userService: UsersService) {}
}
