import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { AppInfo } from 'src/modules/app-info/schema/app-info.schema';
import * as request from 'supertest';
import { testEnv } from './env.test';

describe('AppInfoController (e2e)', () => {
  const appInfoUrl = `${testEnv.baseUrl}/api/v1/app-info`;
  const authUrl = `${testEnv.baseUrl}/api/v1/auth`;

  const mockData: any = {
    type: faker.name.jobType(),
    name: faker.name.jobTitle(),
    appId: faker.datatype.number({ min: 1212121, max: 21212121212 }).toString(),
    version: '1.0.0',
    desc: faker.lorem.lines(),
  };

  const mockUpdateData: any = {
    type: faker.name.jobType(),
    name: faker.name.jobTitle(),
    version: '2.0.0',
    desc: faker.lorem.lines(),
  };

  let _accessToken: string;
  let appInfoId: string;

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

  describe('/app-info (POST)', () => {
    it('it should create new AppInfo', () => {
      try {
        return request(appInfoUrl)
          .post('/')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + _accessToken)
          .send(mockData)
          .expect(HttpStatus.CREATED)
          .expect((response: request.Response) => {
            const appInfo: AppInfo = response.body.data;

            appInfoId = appInfo._id;

            expect(appInfo.type).toEqual(appInfo.type);
            expect(appInfo.name).toEqual(mockData.name);
            expect(appInfo.appId).toEqual(mockData.appId);
            expect(appInfo.version).toEqual(mockData.version);
          });
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe('/app-info (PATCH)', () => {
    it('it should update an AppInfo', () => {
      return request(appInfoUrl)
        .patch(`/${appInfoId}`)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + _accessToken)
        .send(mockUpdateData)
        .expect(HttpStatus.OK)
        .expect((response: request.Response) => {
          const appInfo: AppInfo = response.body.data;

          expect(appInfo.type).toEqual(appInfo.type);
          expect(appInfo.name).toEqual(mockUpdateData.name);
          expect(appInfo.version).toEqual(mockUpdateData.version);
        });
    });
  });
});
