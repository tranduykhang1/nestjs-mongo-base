import { Controller } from '@nestjs/common';
import { FirebaseLibService } from './firebase-lib.service';

@Controller('firebase-lib')
export class FirebaseLibController {
  constructor(private readonly firebaseLibService: FirebaseLibService) {}
}
