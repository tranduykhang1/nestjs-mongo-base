import { TestBed } from '@automock/jest';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { UserRole } from 'src/shared/enums/user.enum';
import { Password } from 'src/utils/password';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login-dto';
import { TokenPayload } from '../interfaces/tokenPayload.interface';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: jest.Mocked<JwtService>,
    userService: jest.Mocked<UsersService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(AuthService).compile();
    authService = unit;
    jwtService = unitRef.get(JwtService);
    userService = unitRef.get(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signToken', () => {
    it('should return a token response with access and refresh tokens', () => {
      const payload: TokenPayload = {
        uid: '1',
        rol: UserRole.USER,
      };
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
      const input: LoginDto = {
        email: 'johndoe@example.com',
        password: 'test',
      };
      const payload: TokenPayload = {
        uid: '0',
        rol: UserRole.USER,
      };

      jwtService.sign.mockReturnValue(`signed-token-for-${payload.uid}`);
      userService.findOne.mockResolvedValueOnce({
        email: 'return@gmail.com',
      } as any);
      jest.spyOn(Password, 'compare').mockReturnValueOnce(true);

      const result: any = await authService.login(input);

      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('at');
      expect(result.data).toHaveProperty('rt');
      expect(result.data.at).toBe(`signed-token-for-${payload.uid}`);
      expect(result.data.rt).toBe(`signed-token-for-${payload.uid}`);
    });
  });
});
