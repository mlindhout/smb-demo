import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly prefix = 'quote_app_';

  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}
