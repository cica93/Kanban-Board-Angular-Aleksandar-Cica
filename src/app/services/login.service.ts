import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  http = inject(HttpClient);

  login(user: Partial<User>): Observable<User> {
    return this.http.post<User>('login', user);
  }
}
