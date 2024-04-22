import { UserRole } from 'src/shared/enums/user.enum';

export interface TokenPayload {
  uid: string;
  rol: UserRole;
  iss?: string;
}
