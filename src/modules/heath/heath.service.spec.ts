import { Test, TestingModule } from '@nestjs/testing';
import { HeathService } from './heath.service';

describe('HeathService', () => {
  let service: HeathService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeathService],
    }).compile();

    service = module.get<HeathService>(HeathService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
