import { Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { SwgCreatedResponse } from 'src/shared/swagger-config/response.swg';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

import { Body, Get, Query } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';
import { Public } from './utils';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiCreatedResponse({
    type: SwgCreatedResponse<null>,
  })
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @ApiCreatedResponse({
    type: SwgCreatedResponse<null>,
  })
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    // return await this.userService.register(registerDto); // Assuming you have a register method in your UsersService
  }

  @ApiCreatedResponse({
    type: SwgCreatedResponse<{ at: string; rt: string }>, // Assuming this is the structure of the response from refresh token endpoint
  })
  @Public()
  @Get('/refresh-token')
  async refreshToken(@Query('refreshToken') refreshToken: string) {
    return;
    // return await this.authService.refreshToken(refreshToken);
  }
}
