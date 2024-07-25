import { Test, TestingModule } from '@nestjs/testing';
import * as firebase from 'firebase-admin';
import { FirebaseLibService } from '../firebase-lib.service';
import { AuthPayload } from '../interface/auth.interface';

describe('FirebaseLibService', () => {
  let service: FirebaseLibService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseLibService],
    }).compile();
    jest.spyOn(firebase, 'initializeApp').mockReturnValue({} as any);

    service = module.get<FirebaseLibService>(FirebaseLibService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('decodeAuthToken', () => {
    it('should decode a valid token and return the payload', async () => {
      const token = 'valid-token';
      const type = 'google';
      const expectedPayload: AuthPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        picture: 'https://example.com/john.jpg',
      };

      jest
        .spyOn(service, '_getInfoByToken')
        .mockResolvedValue(expectedPayload as any);

      const result = await service.decodeAuthToken({ token, type });

      expect(result).toEqual(expectedPayload);
    });

    it('should throw an error if the token is invalid', async () => {
      const token = 'invalid-token';
      const type = 'google';

      jest
        .spyOn(service, '_getInfoByToken')
        .mockRejectedValue(new Error('Invalid token'));

      await expect(
        service.decodeAuthToken({ token, type }),
      ).rejects.toThrowError('Invalid token');
    });
  });
});
