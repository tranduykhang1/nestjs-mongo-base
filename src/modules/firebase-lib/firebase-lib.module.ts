import { Module } from '@nestjs/common';
import { FirebaseLibController } from './firebase-lib.controller';
import { FirebaseLibService } from './firebase-lib.service';
@Module({
  imports: [],
  controllers: [FirebaseLibController],
  providers: [FirebaseLibService],
})
export class FirebaseLibModule {
  constructor() {
    console.log('Connected to Firebase');
  }
}
