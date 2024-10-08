import { Module } from '@nestjs/common';
import { UserSessionsService } from './user-sessions.service';
import { UserSessionsController } from './user-sessions.controller';
import { UserSessionsRepository } from './user-sessions.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSession, UserSessionSchema } from './entities/user-session.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSession.name,
        schema: UserSessionSchema,
      },
    ]),
  ],
  controllers: [UserSessionsController],
  providers: [UserSessionsService, UserSessionsRepository],
  exports: [UserSessionsService],
})
export class UserSessionsModule {}
