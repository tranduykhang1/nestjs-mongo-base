import { Injectable, Logger } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { existsSync } from 'fs';
import { FirebaseAuthDto } from './dto/auth.dto';
import { AuthPayload } from './interface/auth.interface';

@Injectable()
export class FirebaseLibService {
  private logger = new Logger(FirebaseLibService.name);
  constructor() {
    const serviceAccountPath = './auth/auth.json';

    if (!existsSync(serviceAccountPath)) {
      this.logger.error('Firebase service account file not found');
    } else {
      firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccountPath),
      });
    }
  }

  async decodeAuthToken({
    token,
    type,
  }: FirebaseAuthDto): Promise<AuthPayload> {
    const decodedData = this._getInfoByToken(token);
    switch (type) {
      case 'google':
      // handle
      case 'facebook':
      // handle
      case 'apple':
      // handle
    }
    return decodedData;
  }

  async _getInfoByToken(token: string): Promise<any> {
    const ticket = await firebase.auth().verifyIdToken(token);
    return ticket.getPayload();
  }
}
