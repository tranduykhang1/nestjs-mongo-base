import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user-dto';
import * as request from 'supertest';
import { EUserRole } from '../src/shared/enum/user.enum';
import { testEnv } from './env.test';

describe('UserController (e2e)', () => {
  const userUrl = `${testEnv.baseUrl}/api/v1/users`;
  const authUrl = `${testEnv.baseUrl}/api/v1/auth`;

  let _accessToken: string;

  const mockUser: CreateUserDto = {
    displayName: faker.name.fullName(),
    email: `${faker.name.firstName()}@test.com`,
    password: '123123123',
    role: EUserRole.USER,
    avatar: '',
  };
  let userId: string;

  describe('/auth/login (POST)', () => {
    it('it should login with registered account', () => {
      return request(authUrl)
        .post('/login')
        .set('Accept', 'application/json')
        .send({
          loginId: 'admin1',
          password: '123123123',
        })
        .expect((response: request.Response) => {
          const { accessToken } = response.body.data;
          _accessToken = accessToken;

          expect(accessToken).toBeTruthy();
        });
    });
  });

  describe('/users (POST)', () => {
    it('it should create and return a new user', () => {
      return request(userUrl)
        .post('')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + _accessToken)
        .send(mockUser)
        .expect((response: request.Response) => {
          const { _id } = response.body.data;
          userId = _id;
          expect(_id).toBeTruthy();
        })
        .expect(HttpStatus.CREATED);
    });
  });

  describe('/users/{id} (GET)', () => {
    it('it should get a user by id', () => {
      return request(userUrl)
        .get(`/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + _accessToken)
        .expect((response: request.Response) => {
          const { displayName, _id } = response.body.data;

          expect(_id).toEqual(userId);
          expect(displayName).toEqual(mockUser.displayName);
        });
    });
  });

  describe('/users (GET)', () => {
    it('it should get the users', () => {
      return request(userUrl)
        .get('')
        .query({
          limit: 10,
          offset: 0,
        })
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + _accessToken)
        .expect((response: request.Response) => {
          expect(response.body.data.length).toEqual(10);
        });
    });
  });

  describe('/users (PATCH)', () => {
    it('it should update and return new user', () => {
      const updateName = 'updated';
      return request(userUrl)
        .patch(`/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + _accessToken)
        .send({
          displayName: updateName,
        })
        .expect((response: request.Response) => {
          const { displayName } = response.body.data;

          expect(displayName).toEqual(updateName);
        });
    });
  });

  describe('/users/{id} (DELETE)', () => {
    it('it should update and return new user', () => {
      return request(userUrl)
        .delete(`/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + _accessToken)
        .expect(HttpStatus.OK);
    });
  });
});
