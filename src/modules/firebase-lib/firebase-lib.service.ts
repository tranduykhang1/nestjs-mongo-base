import { Injectable, Logger } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as serviceAccount from './auth/auth.json';
import { AuthPayload } from './interface/auth.interface';
import { FirebaseAuthDto } from './dto/auth.dto';

@Injectable()
export class FirebaseLibService {
  private logger = new Logger(FirebaseLibService.name);
  constructor() {
    firebase.initializeApp({
      credential: firebase.credential.cert(
        serviceAccount as firebase.ServiceAccount,
      ),
    });
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
