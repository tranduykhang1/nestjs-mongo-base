import { TestBed } from '@automock/jest';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '../entity/user.entity';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: jest.Mocked<UserDocument>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UsersService).compile();
    usersService = unit;
    userModel = unitRef.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  // Add your tests here
});
