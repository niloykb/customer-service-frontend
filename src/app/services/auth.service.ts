import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

interface User {
  id: number;
  email: string;
  token: string;
}
interface Credentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient)

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

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

}
