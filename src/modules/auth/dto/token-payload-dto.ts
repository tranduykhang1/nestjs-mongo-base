import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({ type: String })
  at: string;

  @ApiProperty({ type: String })
  rt: string;

  @ApiProperty({ type: String })
  session?: string;
}
