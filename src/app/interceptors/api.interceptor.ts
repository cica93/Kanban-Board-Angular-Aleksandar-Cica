import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SecurityService } from '@service/security.service';
import { MessageHandlerService } from '@service/message.handler.service';
import { JwtUtils } from '@service/jwt.service';

const apiBaseUrl = 'http://localhost:3033';

export const ApiInterceptor: HttpInterceptorFn = (req, next) => {
  const token = JwtUtils.getToken();

  const errorHandlerService = inject(MessageHandlerService);
  const securityService = inject(SecurityService);
  const isSkip = req.headers.get("skip");

  const authReq = req.clone({
    url: isSkip
      ? req.url
      : req.url.endsWith('/graphql')
        ? req.url
        : `${apiBaseUrl}/api/${req.url}`,
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
