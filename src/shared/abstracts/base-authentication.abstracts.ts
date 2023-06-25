import { TokenResponse } from 'src/modules/auth/dto/token-payload-dto';

export abstract class BaseAuthentication {
  abstract authenticate(token: string): Promise<TokenResponse>;
}
