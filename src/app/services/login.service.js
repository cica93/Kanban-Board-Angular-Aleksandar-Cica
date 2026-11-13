import { __decorate } from "tslib";
import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
let LoginService = class LoginService {
    http = inject(HttpClient);
    login(user) {
        return this.http.post('login', user, {
            headers: {
                'skip-interceptor': 'true',
            },
        });
    }
};
LoginService = __decorate([
    Service()
], LoginService);
export { LoginService };
//# sourceMappingURL=login.service.js.map