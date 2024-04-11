import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { RegisterDto } from 'src/modules/auth/dto/register-dto';
import { LoginResponse } from 'src/modules/auth/dto/token-payload-dto';
import { ErrorCode } from 'src/shared/errors/constants.error';
import * as request from 'supertest';
import { testEnv } from './env.test';

describe('AuthController (e2e)', () => {
  const authUrl = `${testEnv.baseUrl}/api/v1/auth`;

  let at, rt;

  const mockUser: RegisterDto = {
    firstName: faker.person.fullName(),
    lastName: faker.person.fullName(),
    email: faker.internet.email(),
    password: 'pw123123',
  };

  describe('/auth/register (POST)', () => {
    it('it should register a user', () => {
      return request(authUrl)
        .post('/register')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect(HttpStatus.CREATED);
    });

    it('it should throw the duplicate error', async () => {
      try {
        await request(authUrl)
          .post('/register')
          .set('Accept', 'application/json')
          .send(mockUser);
      } catch (err) {
        expect(err.errorCode).toEqual(ErrorCode.EMAIL_EXISTED);
      }
    });
  });

  describe('/auth/login (POST)', () => {
    it('it should login with registered account', () => {
      return request(authUrl)
        .post('/login')
        .set('Accept', 'application/json')
        .send({
          email: mockUser.email,
          password: mockUser.password,
        })
        .expect((response: request.Response) => {
          const data = response.body.data as LoginResponse;

          at = data.at;
          rt = data.rt;

          expect(at).toBeTruthy();
          expect(rt).toBeTruthy();
        });
    });

    it('it should throw error when wrong credentials', async () => {
      try {
        await request(authUrl)
          .post('/login')
          .set('Accept', 'application/json')
          .send({
            email: 'wrong@email.com',
            password: mockUser.password,
          });
      } catch (err) {
        expect(err.errorCode).toEqual(ErrorCode.WRONG_CREDENTIALS);
      }
    });
  });
});
