import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/user.schema';

describe('UserService', () => {
  let service: UsersService;
  let userModel: UserDocument;

  const userModelProvider = {
    provide: getModelToken(User.name),
    useValue: userModel,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, userModelProvider],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
