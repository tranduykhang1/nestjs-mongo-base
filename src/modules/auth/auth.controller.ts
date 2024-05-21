import { Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

import { Body } from '@nestjs/common';
import { SwgSuccessResponse } from 'src/shared/swagger-config/response.swg';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login-dto';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { RegisterDto } from './dto/register-dto';
import { LoginResponse } from './dto/token-payload-dto';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { RefreshTokenPayload } from './interfaces/tokenPayload.interface';
import { Public } from './utils';

@ApiTags('AUTH')
@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    type: SwgSuccessResponse<LoginResponse>,
  })
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @ApiCreatedResponse({
    type: SwgSuccessResponse<null>,
  })
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @ApiOkResponse({
    type: SwgSuccessResponse<{ at: string; rt: string }>,
  })
  @UseGuards(JwtRefreshGuard)
  @Patch('/refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @CurrentUser() user: RefreshTokenPayload,
  ) {
    return this.authService.refreshToken(user.uid);
  }
}
