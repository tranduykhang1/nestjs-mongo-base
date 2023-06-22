import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T, F = unknown> {
  @ApiProperty({ type: Number, example: 200 })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: '' })
  message?: string;

  @ApiProperty({ type: Number, description: 'Total data in a list resp' })
  total?: number;

  @ApiProperty({ type: Object, description: 'The filter apply' })
  filter?: F | unknown;

  @ApiProperty({ type: Object, isArray: true, description: 'Data returned' })
  data?: T;
}
