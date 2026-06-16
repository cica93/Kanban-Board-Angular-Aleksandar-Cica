import { Observable } from 'rxjs';
import { User } from './user.service';

export const TASK_PRIORITIES = ['LOW', 'MED', 'HIGH'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = ['TO_DO', 'IN_PROGRESS', 'DONE'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

const BADGE_COLORS = ['info', 'warn', 'danger'] as const;
export type BadgeColor = (typeof BADGE_COLORS)[number];

export const BADGE_COLOR_MAP = Object.fromEntries(
  TASK_PRIORITIES.map((priority, index) => [priority, BADGE_COLORS[index]]),
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

  abstract delete(
    id: number,
    version: number,
  ): Observable<Task | null | undefined>;

  abstract drag(dragTask: DragTask): Observable<Task | null | undefined>;
}
