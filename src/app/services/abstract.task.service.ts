import { Observable, Subject } from 'rxjs';
import { User } from './user.service';

export const TASK_PRIORITIES = [
  { value: 'LOW', label: 'LOW' },
  { value: 'MED', label: 'MED' },
  { value: 'HIGH', label: 'HIGH' },
] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number]['value'];

export const TASK_STATUSES = [
  { value: 'TO_DO', label: 'TO DO' },
  { value: 'IN_PROGRESS', label: 'IN PROGRESS' },
  { value: 'DONE', label: 'DONE' },
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number]['value'];

const BADGE_COLORS = ['info', 'warn', 'danger'] as const;
export type BadgeColor = (typeof BADGE_COLORS)[number];

export const BADGE_COLOR_MAP = Object.fromEntries(
  TASK_PRIORITIES.map((priority, index) => [
    priority.value,
    BADGE_COLORS[index],
  ]),
) as Record<TaskPriority, BadgeColor>;

export interface Task {
  id: number;
  title: string;
  version: number;
  taskOrder: number;
  description: string;
  taskStatus: TaskStatus;
  taskPriority: TaskPriority;
  createdBy: string;
  updatedBy: string;
  users: User[];
}

export interface DragTask {
  taskId: number;
  taskStatus: TaskStatus;
  taskOrder: number;
  taskVersion: number;
}

export interface EntityChange<T> {
  entity: T;
  event: 'delete' | 'update' | 'create';
}

export abstract class AbstractTaskService {
  taskChange = new Subject<EntityChange<Task>>();
  abstract get(
    description?: string,
    limit?: number,
    offset?: number,
  ): Observable<Task[]>;

  abstract getById(id: number): Observable<Task>;

  abstract put(
    id: number,
    task: Partial<Task>,
  ): Observable<Task | null | undefined>;

  abstract post(task: Partial<Task>): Observable<Task | null | undefined>;

  abstract delete(
    id: number,
    version: number,
  ): Observable<Task | null | undefined>;

  abstract drag(dragTask: DragTask): Observable<Task | null | undefined>;
}
