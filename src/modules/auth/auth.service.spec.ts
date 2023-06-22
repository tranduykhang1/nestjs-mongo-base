import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { appConfig } from 'src/app.config';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';

describe('AuthService', () => {
  let service: AuthService;

  const jwtServiceProvider = {
    provide: JwtService,
    useFactory: () => ({
      sign: jest.fn().mockReturnValueOnce('token'),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, jwtServiceProvider],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should be register a new account', async () => {
    const input: LoginDto = {
      loginId: 'test1@test.com',
      password: '123123123',
    };

    const res = await service.login(input);

    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.message).toEqual('Success');
  });
});
