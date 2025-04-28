import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SecurityService } from '../services/security.service';
import { MessageHandlerService } from '../services/message.handler.service';
import { JwtService } from '../services/jwt.service';

export const ApiInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const token = jwtService.getToken();

  const errorHandlerService = inject(MessageHandlerService);
  const securityService = inject(SecurityService);
  const isSkip = req.headers.get("skip");

  const authReq = req.clone({
    url: isSkip
      ? req.url
      : req.url.endsWith("/graphql")
      ? req.url
      : `http://localhost:3033/api/${req.url}`,
    setHeaders: {
      ...(token ? { token } : {}),
    },
  });

  return next(authReq).pipe(
    catchError((err: object) => {
      if (err instanceof HttpErrorResponse) {
        const status = (err as HttpErrorResponse).status;
        if (status === 401) {
          securityService.logout();
        } else if (err.error?.message) {
          errorHandlerService.errorEvent.next({
            detail: err.error.message as string,
            summary: "error",
          });
        }
      }
      return throwError(() => err);
    })
  );
};
