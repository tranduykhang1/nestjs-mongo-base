import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './heath.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HeathModule {}
