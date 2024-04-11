import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/shared/enums/user.enum';

export const ROLES_KEY = 'role';
export const AuthRoles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
