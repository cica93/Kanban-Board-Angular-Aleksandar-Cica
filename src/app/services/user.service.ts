import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int().positive(),

  fullName: z.string().trim().min(1, 'Full name is required'),

  email: z.email('Invalid email address'),

  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type User = z.infer<typeof userSchema> & {
  token: string;
  tasks: Task[];
};


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  currentUser(): Observable<User> {
    return this.http.get<User>('users/current').pipe(shareReplay(1));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('users');
  }

  hasMail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`users/has-mail/${email}`, {
      headers: {
        'skip-interceptor': 'true',
      },
    });
  }
}
