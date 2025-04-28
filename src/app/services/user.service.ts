import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: number;
  fullName: string;
  email: string;
  token: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);

  currentUser(): Observable<User> {
    return this.http.get<User>('users/current').pipe(shareReplay(1));
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<{ content: User[] }>('users')
      .pipe(map((a) => a.content));
  }
}
