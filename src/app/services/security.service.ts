import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable, Subject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, UserService } from './user.service';
import { JwtUtils } from './jwt.service';

@Injectable({ providedIn: 'root' })
export class SecurityService {
  user$!: Subject<User | null>;
  rolesChanged$ = new Subject<User>();
  constructor() {
    this.user$ = new BehaviorSubject<User | null>(null);
  }

  userService = inject(UserService);
  router = inject(Router);

  getCurrentUser(): Observable<User | null> {
    return this.userService.currentUser().pipe(
      tap((user) => {
        this.user$.next(user);
      }),
      catchError(() => {
        this.logout();
        return EMPTY;
      }),
    );
  }

  logout(): void {
    JwtUtils.destroyToken();
    this.user$.next(null);
    this.router.navigate(['login']);
  }
}
