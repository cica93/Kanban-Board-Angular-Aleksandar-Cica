import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.service';

export const TASK_PRIORITIES = ['LOW', 'MED', 'HIGH'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUS = ['TO_DO', 'IN_PROGRESS', 'DONE'] as const;
export type TaskStatus = (typeof TASK_STATUS)[number];

export interface Task {
  id: number;
  title: string;
  description: string;
  taskStatus: TaskStatus;
  taskPriority: TaskPriority;
  users: User[];
}

export interface DragTask {
  taskId: number;
  taskStatus: string;
  taskOrder: number;
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
    offset?: number,
  ): Observable<Task[]>;

  abstract getById(id: number): Observable<Task>;

  abstract put(
    id: number,
    task: Partial<Task>,
  ): Observable<Task | null | undefined>;

  abstract patch(
    id: number,
    task: Partial<Task>,
  ): Observable<Task | null | undefined>;

  abstract post(task: Partial<Task>): Observable<Task | null | undefined>;

  abstract delete(id: number): Observable<Task | null | undefined>;

  abstract drag(dragTask: DragTask): Observable<Task | null | undefined>;
}


