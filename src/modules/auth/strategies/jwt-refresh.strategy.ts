import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from 'src/modules/redis/redis.service';
import { REDIS_KEY } from 'src/shared/enums/redis.enum';
import { BaseError } from 'src/shared/errors/base.error';
import { Errors } from 'src/shared/errors/constants.error';
import { appConfig } from '../../../app.config';
import { LoginResponse } from '../dto/token-payload-dto';
import {
  RefreshTokenPayload,
  TokenPayload,
} from '../interfaces/tokenPayload.interface';
import { UserSessionsService } from 'src/modules/user-sessions/user-sessions.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private redisService: RedisService,
    private userSessionsService: UserSessionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: TokenPayload,
  ): Promise<RefreshTokenPayload> {
    try {
      const token = req.body?.token;

      if (!token) {
        throw new BaseError({
          ...Errors.MISSED_TOKEN,
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      const session = await this.userSessionsService.findOne({
        refreshToken: token,
      });

      if (!session) {
        throw new BaseError({
          ...Errors.INVALID_SESSION,
          statusCode: HttpStatus.CONFLICT,
        });
      }

      const userId = payload.uid;
      const decoded = await this.redisService.get<LoginResponse>(
        REDIS_KEY.AUTH_LOGIN + userId,
      );

      if (decoded) {
        if (token !== decoded.rt) {
          throw new BaseError({
            ...Errors.SESSION_EXPIRED,
            statusCode: HttpStatus.UNAUTHORIZED,
          });
        }
        return {
          uid: payload.uid,
        };
      }
      throw new BaseError({
        ...Errors.UNAUTHORIZED,
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    } catch (err) {
      throw err;
    }
  }
}
