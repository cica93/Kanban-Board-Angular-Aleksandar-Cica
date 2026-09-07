import { Observable, Subject } from 'rxjs';
import { User } from './user.service';

export const TASK_PRIORITIES = ['LOW', 'MED', 'HIGH'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];


export const TASK_STATUSES = ['TO DO', 'IN PROGRESS', 'DONE'] as const;
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

export interface TasksByStatus {
  status: TaskStatus;
  tasks: Task[];
}

type UserWithTypeName = User & { __typename: string };

export type TaskAndTypeName = Omit<Task, 'users'> & {
  __typename: string;
  users: UserWithTypeName[];
};

export interface TasksByStatusAndTypeName {
  status: TaskStatus;
  tasks: TaskAndTypeName[];
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
  ): Observable<TasksByStatus[]>;

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
