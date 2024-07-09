import { Controller } from '@nestjs/common';
import { BullQueueService } from './bull-queue.service';

@Controller('bull-queue')
export class BullQueueController {
  constructor(private readonly bullQueueService: BullQueueService) {}
}
