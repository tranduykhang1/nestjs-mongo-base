import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({ type: String })
  accessToken: string;

  @ApiProperty({ type: String })
  refreshToken: string;
}
