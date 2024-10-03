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
  private PLATFORM_ID = inject(PLATFORM_ID);

  private tokenSignal = signal<string | null>(null);
  private authStateLoaded = signal<boolean>(false);
  private currentUserSignal = signal<User | null>(null);

  user = this.currentUserSignal.asReadonly();

  isLoggedIn = computed(() => !!this.tokenSignal() && !!this.currentUserSignal());
  isAuthStateLoaded = computed(() => this.authStateLoaded());

  constructor() {
    this.loadAuthState();
  }

  private loadAuthState(): void {
    if (isPlatformBrowser(this.PLATFORM_ID)) {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      this.tokenSignal.set(token);
      this.currentUserSignal.set(user);
      this.authStateLoaded.set(false);
    } else {
      this.authStateLoaded.set(true);
    }
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registration`, { name, email, password });
  }

  login(credentials: Credentials): Observable<UserLogin> {
    return this.http.post<UserLogin>(`${this.apiUrl}/users/login`, credentials)
      .pipe(tap(response => {
        this.tokenSignal.set(response.token);
        this.currentUserSignal.set(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }));
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);

    localStorage?.removeItem('token');
    localStorage?.removeItem('user');
  }
}

