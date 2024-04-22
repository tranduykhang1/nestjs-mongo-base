import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../errors/constants.error';

export class SwgQueryResponse<T = unknown, F = unknown> {
  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty()
  total: number;

  @ApiProperty()
  filter: F;

  @ApiProperty({ type: Array, example: [] })
  data: T[];
}

export class SwgSuccessResponse<T> {
  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: Object })
  data: T;
}

export class SwgErrorUnAuthResponse {
  @ApiProperty({ enum: ErrorCode })
  errorCode: ErrorCode;

  @ApiProperty({ type: String })
  message: string;
}
