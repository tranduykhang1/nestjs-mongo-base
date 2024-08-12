import { TestBed } from '@automock/jest';
import { UsersRepository } from '../user.repository';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UsersService).compile();
    usersService = unit;
    usersRepository = unitRef.get(UsersRepository);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  // Add your tests here
});
