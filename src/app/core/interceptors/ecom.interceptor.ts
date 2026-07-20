import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from '@services/auth.service';

export const ecomInterceptor: HttpInterceptorFn = (req, next) => {
  // Bypass interceptor for full URLs (like auth) or non-ecom requests
  if (req.url.startsWith('http')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const apiUrl = import.meta.env.NG_APP_CTP_API_URL;
  const projectKey = import.meta.env.NG_APP_CTP_PROJECT_KEY;
  const path = req.url.startsWith('/') ? req.url.slice(1) : req.url;
  const fullUrl = `${apiUrl}/${projectKey}/${path}`;

  return from(authService.getAccessToken()).pipe(
    switchMap((token) => {
      const clonedReq = req.clone({
        url: fullUrl,
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(clonedReq);
    }),
  );
};
