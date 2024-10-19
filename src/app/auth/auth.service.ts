import { Credentials } from './types';
import { Observable, tap } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../shared/models/user.model';
import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';

interface UserLogin {
  user: User,
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient)
  private platformId = inject(PLATFORM_ID);

  private tokenSignal = signal<string | null>(null);
  private currentUserSignal = signal<User | null>(null);

  user = this.currentUserSignal.asReadonly();

  isLoggedIn = computed(() => !!this.tokenSignal() && !!this.currentUserSignal());

  constructor() {
    this.loadAuthState();
  }

  private loadAuthState(): void {
    if (isPlatformBrowser(this.platformId)) {

      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      
      this.tokenSignal.set(token);
      this.currentUserSignal.set(user);
    } 
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/registration`, user);
  }

  login(credentials: Credentials): Observable<UserLogin> {
    return this.http.post<UserLogin>(`${this.apiUrl}/users/login`, credentials)
      .pipe(tap(({token, user}) => {

        this.tokenSignal.set(token);
        this.currentUserSignal.set(user);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }));
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);

    localStorage?.removeItem('token');
    localStorage?.removeItem('user');
  }
}

