import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../shared/models/user.model';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Credentials } from './types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient)

  currentUserSig = signal<User | undefined | null>(undefined);

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registration`, { name, email, password });
  }

  login(credentials: Credentials): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/login`, credentials)
      .pipe(map(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        return response;
      }));
  }
}
