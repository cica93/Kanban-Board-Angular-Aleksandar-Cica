import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.service';

export interface Task {
  id: number;
  title: string;
  description: string;
  taskStatus: string;
  taskPriority: string;
  users: User[];
}


@Injectable({
  providedIn: 'root',
})
export abstract class AbstractTaskService {
  abstract get(
    description: string,
    column?: string[],
    order?: string,
    limit?: number,
    offset?: number
  ): Observable<Task[]>;

  abstract put(id: number, task: Partial<Task>): Observable<Task | null | undefined>;

  abstract patch(id: number, task: Partial<Task>): Observable<Task | null | undefined>;

  abstract post(task: Partial<Task>): Observable<Task | null | undefined>;

  abstract delete(id: number): Observable<Task | null | undefined>;
}


