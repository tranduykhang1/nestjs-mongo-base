import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SwgResponse<T = unknown, F = unknown> {
  @ApiProperty({ example: 200 })
  statusCode: HttpStatus;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ example: null })
  data?: T;

  @ApiProperty({ example: null })
  total?: number;

  @ApiProperty({ example: null })
  filter?: F;

  constructor(statusCode: HttpStatus, message: string, data?: T, filter?: F) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.filter = filter;
  }
}

export class SwgOkResponse<T> extends SwgResponse<T> {
  constructor(data?: T) {
    super(HttpStatus.OK, 'Success', data);
  }
}

export class SwgQueryResponse<T = unknown, F = unknown> extends SwgResponse<
  T[],
  F
> {
  constructor(data: T[], total: number, filter: F) {
    super(HttpStatus.OK, 'Success', data, filter);
    this.total = total;
  }
}

export class SwgCreatedResponse<T> extends SwgResponse<T> {
  constructor(data?: T) {
    super(HttpStatus.CREATED, 'Success', data);
  }
}

export class SwgErrorUnAuthResponse extends SwgResponse {
  constructor(message: string) {
    super(HttpStatus.UNAUTHORIZED, message);
  }
}

export class SwgErrorBadRequestResponse extends SwgResponse {
  constructor(message: string) {
    super(HttpStatus.BAD_REQUEST, message);
  }
}
