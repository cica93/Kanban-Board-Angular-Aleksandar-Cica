import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, Subject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, UserService } from './user.service';

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
      tap((user: User) => {
        this.user$.next(user);
      }),
      catchError(async () => {
        this.user$.next(null);
        return null;
      }),
    );
  }

  logout(): void {
    localStorage.clear();
    this.user$.next(null);
    this.router.navigate(['login']);
  }
}
