// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'access_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>('/api/login', { email, password }).pipe(
      tap(response => {
        localStorage.setItem(this.accessTokenKey, response.accessToken);
        localStorage.setItem(this.refreshTokenKey, response.refreshToken);
      })
    );
  }

  refreshToken() {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);  
    return this.http.post<any>('/api/refresh', { refreshToken }).pipe( 
      tap(response => {
        localStorage.setItem(this.accessTokenKey, response.accessToken);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);  
  }

  getAccessToken() {
    return localStorage.getItem(this.accessTokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
