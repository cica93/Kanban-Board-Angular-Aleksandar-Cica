import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SecurityService } from '@service/security.service';
import { MessageHandlerService } from '@service/message.handler.service';
import { JwtUtils } from '@service/jwt.service';
const apiBaseUrl = 'http://localhost:3033';
export const ApiInterceptor = (req, next) => {
    const token = JwtUtils.getToken();
    const errorHandlerService = inject(MessageHandlerService);
    const securityService = inject(SecurityService);
    const isSkip = req.headers.get('skip');
    const authReq = req.clone({
        url: isSkip ? req.url : req.url.endsWith('/graphql') ? req.url : `${apiBaseUrl}/api/${req.url}`,
        setHeaders: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    return next(authReq).pipe(catchError((err) => {
        if (err instanceof HttpErrorResponse) {
            const status = err.status;
            if (status === 401) {
                securityService.logout();
            }
            else if (err.error?.message) {
                errorHandlerService.errorEvent.next({
                    detail: err.error.message,
                    summary: 'error',
                });
            }
        }
        return throwError(() => err);
    }));
};
//# sourceMappingURL=api.interceptor.js.map