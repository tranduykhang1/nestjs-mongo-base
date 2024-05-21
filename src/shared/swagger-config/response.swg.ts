import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({})
  errorCode: 400;

  @ApiProperty({ type: String })
  message: string;
}
