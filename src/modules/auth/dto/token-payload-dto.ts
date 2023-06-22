import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({ type: String })
  at: string;

  @ApiProperty({ type: String })
  rt: string;
}
