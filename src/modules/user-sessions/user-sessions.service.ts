import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { UserSession } from './entities/user-session.entity';
import { UserSessionsRepository } from './user-sessions.repository';
import { CreateUserSessionDto } from './dto/create-user-session.dto';
import { BaseError } from 'src/shared/errors/base.error';
import { Errors } from 'src/shared/errors/constants.error';

@Injectable()
export class UserSessionsService extends BaseService<UserSession> {
  constructor(
    @Inject(UserSessionsRepository)
    private userSessionsRepository: UserSessionsRepository,
  ) {
    super(userSessionsRepository);
  }

  generateSession(userId: string): string {
    return userId + Date.now();
  }

  async createByUser(input: CreateUserSessionDto): Promise<UserSession> {
    try {
      return await this.create(input);
    } catch (err) {
      throw err;
    }
  }

  async checkSession(userId: string): Promise<void> {
    try {
      const session = await this.findOne({ userId, isActive: true });
      if (session) {
        throw new BaseError(Errors.LOGIN_WITH_ANOTHER_DEVICE);
      }
      return;
    } catch (err) {
      throw err;
    }
  }

  async disable(userId: string): Promise<UserSession> {
    try {
      return await this.update(
        {
          userId,
          isActive: true,
        },
        { isActive: false },
      );
    } catch (err) {
      throw err;
    }
  }
}
