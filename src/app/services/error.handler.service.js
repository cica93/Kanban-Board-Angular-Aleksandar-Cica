import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
let GlobalErrorHandler = class GlobalErrorHandler {
    injector;
    constructor(injector) {
        this.injector = injector;
    }
    handleError(error) {
        const router = this.injector.get(Router);
        if (error instanceof HttpErrorResponse) {
            // Handle HTTP errors
            console.error('HTTP Error:', error.status, error.message);
            if (error.status === 404) {
                router.navigate(['/not-found']);
            }
            else if (error.status === 401) {
                router.navigate(['/login']);
            }
        }
        else {
            // Handle Client Errors
            console.error('Client Error:', error);
        }
    }
};
GlobalErrorHandler = __decorate([
    Injectable({ providedIn: 'root' })
], GlobalErrorHandler);
export { GlobalErrorHandler };
//# sourceMappingURL=error.handler.service.js.map