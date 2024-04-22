import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseError } from 'src/shared/errors/base.error';
import { ErrorCode } from 'src/shared/errors/constants.error';
import { BaseResponse } from 'src/shared/responses/base.response';
import { Password } from 'src/utils/password';
import { User } from '../users/entity/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';
import { LoginResponse } from './dto/token-payload-dto';
import { TokenPayload } from './interfaces/tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  signToken(payload: TokenPayload): LoginResponse {
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
        if (!Password.compare(user.password, user.key, password)) {
          throw new BaseError({
            statusCode: HttpStatus.UNAUTHORIZED,
            errorCode: ErrorCode.WRONG_CREDENTIALS,
          });
        }

        const payload: TokenPayload = {
          uid: user._id,
          rol: user.role,
        };
        await this.usersService.update({ email }, { lastLogin: new Date() });

        return {
          data: this.signToken(payload),
        };
      }
      throw new BaseError({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: ErrorCode.WRONG_CREDENTIALS,
      });
    } catch (err) {
      throw new BaseError({
        errorCode: ErrorCode.LOGIN_FAILED,
        message: err?.message,
      });
    }
  }

  async register(input: RegisterDto): Promise<BaseResponse<User>> {
    try {
      const { email, password } = input;
      let user = await this.usersService.findOne({ email });
      if (user) {
        throw new BaseError({
          errorCode: ErrorCode.EMAIL_EXISTED,
          statusCode: HttpStatus.CONFLICT,
        });
      }
      const { encryptedData, key } = Password.encrypt(password);

      user = await this.usersService.create({
        ...input,
        password: encryptedData,
        key,
      });

      return {
        message: 'Verification link has been sent',
        data: user,
      };
    } catch (err) {
      throw new BaseError({
        errorCode: ErrorCode.LOGIN_FAILED,
        message: err?.message,
      });
    }
  }
}
