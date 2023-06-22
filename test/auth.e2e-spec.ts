import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { testEnv } from './env.test';

describe('AuthController (e2e)', () => {
  const authUrl = `${testEnv.baseUrl}/api/v1/auth`;

  let _accessToken;
  let _refreshToken;
  const mockUser: any = {
    displayName: faker.name.fullName(),
    loginId: faker.name.firstName().toLowerCase(),
    password: 'password',
  };
  console.log(authUrl);

  describe('/auth/register (POST)', () => {
    it('it should register a user', () => {
      return request(authUrl)
        .post('/register')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect(HttpStatus.CREATED);
    });
  });

  describe('/auth/login (POST)', () => {
    it('it should login with registered account', () => {
      return request(authUrl)
        .post('/login')
        .set('Accept', 'application/json')
        .send({
          loginId: mockUser.loginId,
          password: mockUser.password,
        })
        .expect((response: request.Response) => {
          const { accessToken, refreshToken } = response.body.data;
          _accessToken = accessToken;
          _refreshToken = refreshToken;

          expect(accessToken).toBeTruthy();
          expect(refreshToken).toBeTruthy();
        });
    });
  });

  describe('/auth/login (POST)', () => {
    it('it should throw error when missing loginId', () => {
      try {
        return request(authUrl)
          .post('/login')
          .set('Accept', 'application/json')
          .send({
            password: mockUser.password,
          });
      } catch (err) {
        console.log(err);
        expect(err.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('/auth/refresh-token (POST)', () => {
    it('it should create new access and refresh token', () => {
      return request(authUrl)
        .post('/refresh-token')
        .set('Accept', 'application/json')
        .send({
          token: _refreshToken,
        })
        .expect((response: request.Response) => {
          const { accessToken, refreshToken } = response.body.data;

          expect(accessToken).toBeTruthy();
          expect(refreshToken).toBeTruthy();
        });
    });
  });

  describe('/auth/me (GET)', () => {
    it('it should return the new object user', () => {
      return request(authUrl)
        .get('/me')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + _accessToken)
        .expect((response: request.Response) => {
          const { displayName } = response.body.data;

          expect(displayName).toEqual(mockUser.displayName);
        });
    });
  });
});
