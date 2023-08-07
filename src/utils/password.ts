import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';
import { appConfig } from '../app.config';

const algorithm = 'aes-256-cbc';

const encryptionIV = createHash('sha512')
  .update(appConfig.pwSecret)
  .digest('hex')
  .substring(0, 16);

export class Password {
  static encrypt(text: string): { key: string; encryptedData: string } {
    try {
      const key = randomBytes(16).toString('hex');
      const cipher = createCipheriv(algorithm, key, encryptionIV);
      return {
        key: key,
        encryptedData: Buffer.from(
          cipher.update(text, 'utf8', 'hex') + cipher.final('hex'),
        ).toString('base64'),
      }; //
    } catch (err) {
      return err;
    }
  }

  static decrypt(key: string, encryptedData: string): string {
    const buff = Buffer.from(encryptedData, 'base64');
    const decipher = createDecipheriv(algorithm, key, encryptionIV);
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    );
  }

  static compare(
    password: string,
    key: string,
    encryptedData: string,
  ): boolean {
    try {
      const buff = Buffer.from(encryptedData, 'base64');
      const decipher = createDecipheriv(algorithm, key, encryptionIV);
      const res =
        decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
        decipher.final('utf8');
      return res === password;
    } catch (err) {
      return err;
    }
  }
}
