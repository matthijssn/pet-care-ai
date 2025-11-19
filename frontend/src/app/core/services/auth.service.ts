// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'access_token';

  constructor(private http: HttpClient) {}

  private url(path: string) {
    // ensure no double slashes
    return `${environment.baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }

  login(email: string, password: string) {
    return this.http.post<any>(this.url('api/auth/login'), { email, password }).pipe(
      tap(response => {
        localStorage.setItem(this.accessTokenKey, response.accessToken);
        localStorage.setItem(this.refreshTokenKey, response.refreshToken);
      })
    );
  }

  refreshToken() {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);  
    return this.http.post<any>(this.url('api/auth/refresh'), { refreshToken }).pipe( 
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

  checkHealth() : Observable<{status: string}> {
    return this.http.get<{status: string}>(this.url('api/auth/health'));    
  }
}
