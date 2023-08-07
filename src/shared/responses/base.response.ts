import { HttpStatus } from '@nestjs/common';

export class BaseResponse<T = unknown, F = unknown> {
  statusCode?: HttpStatus;

  message?: string;

  total?: number;

  filter?: F;

  data?: T;
}
