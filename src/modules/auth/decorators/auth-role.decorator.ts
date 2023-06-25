import { SetMetadata } from '@nestjs/common';
import { EUserRole } from 'src/shared/enum/user.enum';

export const ROLES_KEY = 'role';
export const AuthRoles = (...roles: EUserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
