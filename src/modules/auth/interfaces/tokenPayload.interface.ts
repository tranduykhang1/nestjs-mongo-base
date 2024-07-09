import { USER_ROLE } from 'src/shared/enums/user.enum';

export interface TokenPayload {
  uid: string;
  rol: USER_ROLE;
  ema?: string;
}
export interface RefreshTokenPayload {
  uid: string;
}
