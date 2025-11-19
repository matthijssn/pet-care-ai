import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor : HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && authService.getAccessToken()) {
            return authService.refreshToken().pipe(
                switchMap(() => {
                    const newToken = authService.getAccessToken();
                    const retryReq = req.clone({
                        setHeaders: { Authorization: `Bearer ${newToken}` }
                    });
                    return next(retryReq);
                }),
                catchError(() => {
                    authService.logout();
                    return throwError(() => error);
                })
            );
        }
        return throwError(() => error);
    })
  )
};
