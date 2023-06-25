import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppSecret } from '../src/modules/app-secret/schemas/app-secret.schema';
import { testEnv } from './env.test';

describe('AppSecretController (e2e)', () => {
  const appUrl = `${testEnv.baseUrl}/api/v1/app`;
  const authUrl = `${testEnv.baseUrl}/api/v1/auth`;

  const mockData: any = {
    appId: '1000001',
    name: faker.name.jobTitle(),
    desc: faker.name.jobDescriptor(),
  };

  let _accessToken: string;

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

  describe('/app/admin/gen (POST)', () => {
    it('it should generate new appKey', () => {
      return request(appUrl)
        .post('/admin/gen')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + _accessToken)
        .send(mockData)
        .expect(HttpStatus.CREATED)
        .expect((response: request.Response) => {
          const appSecret: AppSecret = response.body.data;

          expect(appSecret.appKey).toBeTruthy();
          expect(appSecret.appId).toEqual(mockData.appId);
        });
    });
  });
});
