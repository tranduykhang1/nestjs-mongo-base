import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SwgOkResponse<T> {
  @ApiProperty({ type: Number, example: 200 })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Success!' })
  message?: string;

  @ApiProperty({ type: Object, description: 'Data returned' })
  data?: T;
}

export class SwgCreatedREsponse<T> {
  @ApiProperty({ type: Number, example: 200 })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Success!' })
  message?: string;

  @ApiProperty({ type: Object, description: 'Data returned' })
  data?: T;
}
