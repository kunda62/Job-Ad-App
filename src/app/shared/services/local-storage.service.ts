import { Injectable } from '@angular/core';
import  *  as CryptoJS from  'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  key = "123";

  /**
   * Save data to local storage
   * @param key 
   * @param value 
   */
  saveData(key: string, value: string): void {
    localStorage.setItem(key, this.encrypt(value));
  }

  /**
   * Get data from local storage
   * @param key 
   * @returns 
   */
  getData(key: string): any {
    const data = localStorage.getItem(key)|| "";
    return this.decrypt(data);
  }

  /**
   * Remove data from local storage
   * @param key 
   */
  removeData(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear data from local storage
   */
  clearData(): void {
    localStorage.clear();
  }

  /**
   * Encrypt data
   * @param txt 
   * @returns 
   */
  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  /**
   * Decrypt data
   * @param txtToDecrypt 
   * @returns 
   */
  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }
}
