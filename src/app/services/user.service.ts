import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { z } from 'zod';
import { PageResponse, Task } from './abstract.task.service';

export const userSchema = z.object({
  id: z.number().int().positive(),

  fullName: z.string().trim().min(1, 'Full name is required'),

  email: z.email('Invalid email address'),

  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type User = z.infer<typeof userSchema> & {
  token: string;
  tasks: Task[];
  image: string;
  __typename?: 'Task';
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  currentUser(): Observable<User> {
    return this.http.get<User>('users/current');
  }

  getUsers(
    keyword = '',
    limit = 10,
    offset = 0,
    columnSort = 'id',
    direction = 'asc',
  ): Observable<PageResponse<User>> {
    return this.http
      .get<PageResponse<User>>('users', {
        params: { keyword, limit, offset, columnSort, direction },
      })
      .pipe(
        map(({ totalCount, content }) => ({
          content: content.map((user) => {
            const { tasks, token, image, ...rest } = user;
            return rest as User;
          }),
          totalCount,
        })),
      );
  }

  hasMail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`users/has-email/${email}`, {
      headers: {
        'skip-interceptor': 'true',
      },
    });
  }
}
