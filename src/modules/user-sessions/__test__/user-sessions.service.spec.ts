import { TestBed } from '@automock/jest';
import { UserSessionsService } from '../user-sessions.service';
import { UserSessionsRepository } from '../user-sessions.repository';

describe('UserSessionsService', () => {
  let userSessionsService: UserSessionsService;
  let userSessionsRepository: jest.Mocked<UserSessionsRepository>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UserSessionsService).compile();
    userSessionsService = unit;
    userSessionsRepository = unitRef.get(UserSessionsRepository);
  });

  it('should be defined', () => {
    expect(userSessionsService).toBeDefined();
    expect(userSessionsRepository).toBeDefined();
  });

  // Add your tests here
});
