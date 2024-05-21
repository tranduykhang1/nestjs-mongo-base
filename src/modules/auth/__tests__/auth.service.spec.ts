import { TestBed } from '@automock/jest';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { UserRole } from 'src/shared/enums/user.enum';
import { BaseError } from 'src/shared/errors/base.error';
import { Errors } from 'src/shared/errors/constants.error';
import { Password } from 'src/utils/password';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login-dto';
import { RegisterDto } from '../dto/register-dto';
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

    it('should return the error with wrong password', async () => {
      const input: LoginDto = {
        email: 'wrong@example.com',
        password: 'wrong',
      };
      const payload: TokenPayload = {
        uid: '0',
        rol: UserRole.USER,
      };

      jwtService.sign.mockReturnValue(`signed-token-for-${payload.uid}`);
      userService.findOne.mockResolvedValueOnce({
        email: 'return@gmail.com',
      } as any);
      jest.spyOn(Password, 'compare').mockReturnValueOnce(false);
      await expect(authService.login(input)).rejects.toStrictEqual(
        new BaseError(Errors.WRONG_CREDENTIALS),
      );
    });
  });

  describe('register', () => {
    it('should throw an error when the email is already registered', async () => {
      const input: RegisterDto = {
        email: 'duplicate@example.com',
        password: 'password123',
        firstName: '',
        lastName: '',
      };

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce({
        email: 'duplicate@example.com',
      } as any);

      await expect(authService.register(input)).rejects.toThrow(
        new BaseError(Errors.DUPLICATE_EMAIL),
      );
    });

    it('should register a new user successfully', async () => {
      const input: RegisterDto = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const encryptedPassword = 'encrypted-password';
      const encryptionKey = 'encryption-key';

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(Password, 'encrypt').mockReturnValueOnce({
        encryptedData: encryptedPassword,
        key: encryptionKey,
      });
      jest.spyOn(userService, 'create').mockResolvedValueOnce({
        email: 'new@example.com',
        password: encryptedPassword,
        key: encryptionKey,
      } as any);

      const result = await authService.register(input);

      expect(result).toEqual({
        message: 'Verification link has been sent',
        data: {
          email: 'new@example.com',
          password: encryptedPassword,
          key: encryptionKey,
        },
      });
    });
  });
});
