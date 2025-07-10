import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const router = this.injector.get(Router);

    if (error instanceof HttpErrorResponse) {
      // Handle HTTP errors
      console.error('HTTP Error:', error.status, error.message);
      if (error.status === 404) {
        router.navigate(['/not-found']);
      } else if (error.status === 401) {
        router.navigate(['/login']);
      }
    } else {
      // Handle Client Errors
      console.error('Client Error:', error);
    }

    // Optional: Log to external service
    // logService.log(error);

    // Re-throw if you want to propagate the error
    // throw error;
  }
}
