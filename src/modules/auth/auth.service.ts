import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { appConfig } from 'src/app.config';
import { REDIS_KEY, REDIS_TTL } from 'src/shared/enums/redis.enum';
import { BaseError } from 'src/shared/errors/base.error';
import { Errors } from 'src/shared/errors/constants.error';
import { BaseResponse } from 'src/shared/responses/base.response';
import { Password } from 'src/utils/password';
import { MailQueueProducer } from '../bull-queue/mail-queue/mail-queue.producer';
import { RedisService } from '../redis/redis.service';
import { User } from '../users/entity/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';
import { LoginResponse } from './dto/token-payload-dto';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import { UserSessionsService } from '../user-sessions/user-sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly redisServices: RedisService,
    private readonly mailQueueProducer: MailQueueProducer,
    private readonly userSessionsService: UserSessionsService,
  ) {}

  signToken(payload: TokenPayload): Omit<LoginResponse, 'session'> {
    return {
      at: this.jwtService.sign(payload),
      rt: this.jwtService.sign({ uid: payload.uid }),
    };
  }

  async login({
    email,
    password,
  }: LoginDto): Promise<BaseResponse<LoginResponse>> {
    try {
      const user = await this.usersService.findOne({ email });
      if (user) {
        if (!Password.compare(password, user.key, user.password)) {
          throw new BaseError(Errors.WRONG_CREDENTIALS);
        }

        await this.userSessionsService.checkSession(user._id);

        const payload: TokenPayload = {
          uid: user._id,
          rol: user.role,
          ema: user.email,
        };

        const data = this.signToken(payload),
          session = this.userSessionsService.generateSession(user._id);

        await Promise.all([
          this.usersService.update({ email }, { lastActivity: new Date() }),
          this.redisServices.set(
            `${REDIS_KEY.AUTH_LOGIN}${user._id}`,
            data,
            REDIS_TTL.AUTH_LOGIN,
          ),
          this.userSessionsService.createByUser({
            userId: user._id,
            refreshToken: data.rt,
            session,
          }),
        ]);

        return {
          data,
        };
      }
      throw new BaseError(Errors.WRONG_CREDENTIALS);
    } catch (err) {
      throw err;
    }
  }

  async register(input: RegisterDto): Promise<BaseResponse<User>> {
    try {
      const { email, password } = input;
      let user = await this.usersService.findOne({ email });
      if (user) {
        throw new BaseError(Errors.DUPLICATE_EMAIL);
      }
      const { encryptedData, key } = Password.encrypt(password);

      user = await this.usersService.create({
        ...input,
        password: encryptedData,
        key,
      });

      const verificationKey = await this.signVerificationToken();
      this.mailQueueProducer.sendRegistration(email, verificationKey);

      return {
        message: 'Verification link has been sent',
        data: user,
      };
    } catch (err) {
      throw err;
    }
  }

  async refreshToken(userId: string): Promise<BaseResponse<LoginResponse>> {
    const user = await this.usersService.findOneUseStrict({ _id: userId });
    const payload: TokenPayload = {
      uid: user._id,
      rol: user.role,
      ema: user.email,
    };
    const data = this.signToken(payload);

    await this.userSessionsService.update(
      { userId },
      { refreshToken: data.rt },
    );

    return {
      data,
    };
  }

  signVerificationToken(): string {
    const { key } = Password.encrypt(appConfig.jwtRefreshSecret);
    return key;
  }
}
