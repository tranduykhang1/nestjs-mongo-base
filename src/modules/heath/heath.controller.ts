import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Connection } from 'mongoose';

@ApiTags('HEATH')
@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    @InjectConnection() private readonly mongooseConnection: Connection,
    private readonly mongooseHealth: MongooseHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () =>
        this.mongooseHealth.pingCheck('mongo', {
          connection: this.mongooseConnection,
        }),
    ]);
  }
}
