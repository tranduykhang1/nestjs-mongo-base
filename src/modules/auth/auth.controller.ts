import { Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SwgSuccessResponse } from 'src/shared/swagger-config/response.swg';
import { AuthService } from './auth.service';

import { Body, Get, Query } from '@nestjs/common';
import { appConfig } from 'src/app.config';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';
import { LoginResponse } from './dto/token-payload-dto';
import { Public } from './utils';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    type: SwgSuccessResponse<LoginResponse>,
  })
  @Post('/login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    console.log(appConfig);
    return await this.authService.login(loginDto);
  }

  @ApiCreatedResponse({
    type: SwgSuccessResponse<null>,
  })
  @Post('/register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @ApiCreatedResponse({
    type: SwgSuccessResponse<{ at: string; rt: string }>,
  })
  @Public()
  @Get('/refresh-token')
  async refreshToken(@Query('refreshToken') refreshToken: string) {
    return refreshToken;
  }
}
