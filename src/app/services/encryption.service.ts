import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKeyPart1: string = environment.secretKeyPart1;
  private secretKeyPart2: string = 'static-part-key'; // Hard-coded but obfuscated part of the key

  constructor() { }

  private getSecretKey(): string {
    // Combine parts to create the final key
    return this.secretKeyPart1 + this.secretKeyPart2;
  }

  close(data: string): string {
    const secretKey = this.getSecretKey();
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  }

  open(data: string): string {
    const secretKey = this.getSecretKey();
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
