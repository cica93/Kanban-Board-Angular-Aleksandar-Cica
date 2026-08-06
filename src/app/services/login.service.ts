import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from './user.service';


@Service()
export class LoginService {
  private readonly http = inject(HttpClient);

  login(user: Partial<User>): Observable<User> {
    return this.http.post<User>('login', user, {
      headers: {
        'skip-interceptor': 'true',
      },
    });
  }
}
