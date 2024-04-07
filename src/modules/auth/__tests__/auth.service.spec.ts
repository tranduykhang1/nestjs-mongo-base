import { TestBed } from '@automock/jest';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { ITokenPayload } from '../models/token-payload.model';
import { LoginDto } from '../dto/login-dto';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: jest.Mocked<JwtService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(AuthService).compile();
    authService = unit;
    jwtService = unitRef.get(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signToken', () => {
    it('should return a token response with access and refresh tokens', () => {
      const payload = { uid: '1', iss: 'test', nam: 'testUser', rol: 'USER' };
      jwtService.sign.mockReturnValue(`signed-token-for-${payload.uid}`);

      const tokens = authService.signToken(payload);

      expect(tokens).toEqual({
        at: `signed-token-for-${payload.uid}`,
        rt: `signed-token-for-${payload.uid}`,
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });
  });

  describe('login', () => {
    it('should return a base response with token data', async () => {
      const input: LoginDto = { loginId: 'test', password: 'test' }; // Replace with actual LoginDto structure
      const payload: ITokenPayload = {
        uid: '0',
        iss: 'example',
        nam: 'example',
        rol: 'ADMIN',
      };

      jwtService.sign.mockReturnValue(`signed-token-for-${payload.uid}`);

      const result: any = await authService.login(input);

      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('at');
      expect(result.data).toHaveProperty('rt');
      expect(result.data.at).toBe(`signed-token-for-${payload.uid}`);
      expect(result.data.rt).toBe(`signed-token-for-${payload.uid}`);
    });
  });
});
