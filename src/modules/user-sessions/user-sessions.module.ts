import { Module } from '@nestjs/common';
import { UserSessionsService } from './user-sessions.service';
import { UserSessionsController } from './user-sessions.controller';
import { UserSessionsRepository } from './user-sessions.repository';
import { UserSession } from './entities/user-session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserSession])],
  controllers: [UserSessionsController],
  providers: [UserSessionsService, UserSessionsRepository],
  exports: [UserSessionsService],
})
export class UserSessionsModule {}
