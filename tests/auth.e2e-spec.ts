import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RegisterDto } from 'src/modules/auth/dto/register-dto';
import { LoginResponse } from 'src/modules/auth/dto/token-payload-dto';
import { Errors } from 'src/shared/errors/constants.error';
import * as request from 'supertest';
import { MongoMemoryTestModule } from './mongo-test.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication, mongoServer: MongoMemoryServer;

  const mockUser: RegisterDto = {
    email: 'johndoe@example.com',
    password: '123123123',
    firstName: 'John',
    lastName: 'Doe',
  };

  let rt;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const moduleRef = await Test.createTestingModule({
      imports: [
        AuthModule,
        await MongoMemoryTestModule.createMongooseTestModule(),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([mongoServer.stop(), app.close()]);
  });

  describe('/auth/register (POST)', () => {
    it('it should register a user', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect(HttpStatus.CREATED);
    });

    it('it should throw the duplicate error', async () => {
      try {
        return request(app.getHttpServer())
          .post('/auth/register')
          .set('Accept', 'application/json')
          .send(mockUser);
      } catch (err) {
        expect(err.errorCode).toEqual(Errors.EMAIL_EXISTED);
      }
    });
  });

  describe('/auth/login (POST)', () => {
    it('it should login with registered account', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: mockUser.email,
          password: mockUser.password,
        })
        .expect((response: request.Response) => {
          const data = response.body.data as LoginResponse;

          const at = data.at;
          rt = data.rt;

          expect(at).toBeTruthy();
          expect(rt).toBeTruthy();
        });
    });

    it('it should throw error when wrong credentials', async () => {
      try {
        await request(app.getHttpServer())
          .post('/auth/login')
          .set('Accept', 'application/json')
          .send({
            email: 'wrong@email.com',
            password: mockUser.password,
          });
      } catch (err) {
        expect(err.errorCode).toEqual(Errors.WRONG_CREDENTIALS);
      }
    });
  });

  // describe('/auth/refresh-token (GET)', () => {
  //   it('it should get new tokens with provided refresh token', () => {
  //     return request(app.getHttpServer())
  //       .get('/auth/refresh-token')
  //       .set('Accept', 'application/json')
  //       .send({
  //         token: rt,
  //       })
  //       .expect((response: request.Response) => {
  //         const data = response.body.data as LoginResponse;

  //         const at = data.at,
  //           rt = data.rt;

  //         expect(at).toBeTruthy();
  //         expect(rt).toBeTruthy();
  //       });
  //   });

  //   it('it should throw error when wrong credentials', async () => {
  //     try {
  //       await request(app.getHttpServer())
  //         .post('/auth/login')
  //         .set('Accept', 'application/json')
  //         .send({
  //           token:
  //             'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  //         });
  //     } catch (err) {
  //       expect(err.errorCode).toEqual(Errors.COMMON_ERROR);
  //     }
  //   });
  // });
});
