import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRoles } from '../auth/decorators/auth-role.decorator';
import { UsersService } from './users.service';
import { UserRole } from '../../shared/enums/user.enum';

@ApiTags('USER')
@ApiBearerAuth()
@Controller('users')
@AuthRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class UsersController {
  constructor(private readonly userService: UsersService) {}
}
