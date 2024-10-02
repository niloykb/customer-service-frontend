import { map, Observable, of } from 'rxjs';
import { Credentials } from './types';
import { HttpClient } from '@angular/common/http';
import { User } from '../shared/models/user.model';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';

interface UserLogin {
  user: User,
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class  AuthService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient)

  private currentUserSignal = signal<User | null>(null);

  user = this.currentUserSignal.asReadonly();

  isLoggedIn = computed(() => !!this.user())

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registration`, { name, email, password });
  }

  login(credentials: Credentials): Observable<UserLogin> {
    return this.http.post<UserLogin>(`${this.apiUrl}/users/login`, credentials)
      .pipe(map(response => {
        this.currentUserSignal.set(response?.user);
          localStorage.setItem('token', response?.token);
        return response;
      }));
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage?.removeItem('token');
  }

  validateToken(): boolean {
    const token = localStorage?.getItem('token');
      return !!token;
    }
  }

