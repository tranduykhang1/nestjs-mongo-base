import { SetMetadata } from '@nestjs/common';
import { USER_ROLE } from 'src/shared/enums/user.enum';

export const ROLES_KEY = 'role';
export const AuthRoles = (...roles: USER_ROLE[]) =>
  SetMetadata(ROLES_KEY, roles);
