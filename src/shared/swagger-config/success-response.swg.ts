import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SwgOkResponse<T> {
  @ApiProperty({ type: Number, example: 200 })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Success' })
  message?: string;

  @ApiProperty({
    type: Object as T,
    example: { _id: '_id', '[field]': 'value' },
  })
  data?: T;
}

export class SwgQueryResponse<T = unknown, F = unknown> {
  @ApiProperty({ example: 200 })
  statusCode: HttpStatus;

  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty()
  total: number;

  @ApiProperty()
  filter: F;

  @ApiProperty({ type: Array, example: [] })
  data: T[];
}

export class SwgCreatedResponse<T> {
  @ApiProperty({ type: Number, example: 201 })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Success' })
  message?: string;

  @ApiProperty({
    type: Object as T,
    example: { _id: '_id', '[field]': 'value' },
  })
  data?: T;
}
