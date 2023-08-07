import { Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../../modules/users/users.service';
import { AuthService } from './auth.service';
import { SwgCreatedResponse } from 'src/shared/swagger-config/success-response.swg';

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
  create() {
    return;
  }
}
