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
import { TokenPayload } from '../interfaces/tokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload): Promise<TokenPayload> {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new BaseError({
          ...Errors.UNAUTHORIZED,
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      const userId = payload.uid;
      const decoded = await this.redisService.get<LoginResponse>(
        REDIS_KEY.AUTH_LOGIN + userId,
      );

      if (decoded) {
        if (token !== decoded.at) {
          throw new BaseError({
            ...Errors.SESSION_EXPIRED,
            statusCode: HttpStatus.UNAUTHORIZED,
          });
        }
        return {
          uid: payload.uid,
          rol: payload.rol,
        };
      }
      throw new BaseError({
        ...Errors.UNAUTHORIZED,
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    } catch (err) {
      throw new BaseError({
        ...Errors.UNAUTHORIZED,
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }
}
