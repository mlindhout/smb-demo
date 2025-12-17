import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

export interface User {
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'current_user';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadUser();
  }

  private loadUser(): void {
    const user = this.storageService.get<User>(this.STORAGE_KEY);
    this.currentUserSubject.next(user);
  }

  login(email: string, password: string): boolean {
    if (email && password) {
      const user: User = {
        email,
        name: email.split('@')[0]
      };
      this.storageService.set(this.STORAGE_KEY, user);
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  logout(): void {
    this.storageService.remove(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
