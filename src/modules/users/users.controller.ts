import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TokenPayload } from 'google-auth-library';
import { SwgSuccessResponse } from 'src/shared/swagger-config/response.swg';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@ApiTags('USER')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({
    type: SwgSuccessResponse<User>,
  })
  @Get('/me')
  async getMe(@CurrentUser() user: TokenPayload) {
    console.log(user);
    return;
  }
}
