import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseResponse } from 'src/shared/responses/base.response';
import { LoginDto } from './dto/login-dto';
import { TokenResponse } from './dto/token-payload-dto';
import { ITokenPayload } from './models/token-payload.model';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  signToken(payload: ITokenPayload): TokenResponse {
    return {
      at: this.jwtService.sign(payload),
      rt: this.jwtService.sign(payload),
    };
  }

  async login(input: LoginDto): Promise<BaseResponse<TokenResponse>> {
    console.log(input);
    const payload: ITokenPayload = {
      uid: '0',
      iss: 'example',
      nam: 'example',
      rol: 'ADMIN',
    };
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: this.signToken(payload),
    };
  }
}
