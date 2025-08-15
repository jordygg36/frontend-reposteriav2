import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class DecryptIdResolver implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot): string {
    const encryptedId = route.paramMap.get('idusuarios');
    if (encryptedId) {
      const bytes = CryptoJS.AES.decrypt(encryptedId, 'secret-key');
      const decryptedId = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedId;
    }
    return '';
  }
}
