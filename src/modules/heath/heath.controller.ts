import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';

@ApiTags('HEATH')
@Controller('health')
@Public()
export class HealthController {
  constructor() {}
}
