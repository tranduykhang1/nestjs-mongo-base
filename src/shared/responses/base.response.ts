import { HttpStatus } from '@nestjs/common';

export class BaseResponse<T = unknown, F = unknown> {
  status?: HttpStatus;

  message?: string;

  total?: number;

  filter?: F;

  data?: T;
}
