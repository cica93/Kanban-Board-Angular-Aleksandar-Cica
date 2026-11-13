import { __decorate } from "tslib";
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Subject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { JwtUtils } from './jwt.service';
let SecurityService = class SecurityService {
    user$;
    rolesChanged$ = new Subject();
    constructor() {
        this.user$ = new BehaviorSubject(null);
    }
    userService = inject(UserService);
    router = inject(Router);
    getCurrentUser() {
        return this.userService.currentUser().pipe(tap((user) => {
            this.user$.next(user);
        }), catchError(() => {
            this.logout();
            return EMPTY;
        }));
    }
    logout() {
        JwtUtils.destroyToken();
        this.user$.next(null);
        this.router.navigate(['login']);
    }
};
SecurityService = __decorate([
    Injectable({ providedIn: 'root' })
], SecurityService);
export { SecurityService };
//# sourceMappingURL=security.service.js.map