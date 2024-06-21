import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SwgSuccessResponse } from 'src/shared/swagger-config/response.swg';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokenPayload } from '../auth/interfaces/tokenPayload.interface';
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
  async getMe(@CurrentUser() { uid }: TokenPayload) {
    return this.userService.findOne({ _id: uid });
  }
}
