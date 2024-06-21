import { ThrottlerGuard } from '@nestjs/throttler';
import { BaseError } from 'src/shared/errors/base.error';
import { Errors } from 'src/shared/errors/constants.error';

export class AppThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(): Promise<void> {
    throw new BaseError(Errors.TOO_MANY_REQUEST);
  }
}
