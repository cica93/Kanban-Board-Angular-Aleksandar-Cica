import { Observable, Subject } from 'rxjs';
import { User } from './user.service';

export const TASK_PRIORITIES = ['LOW', 'MED', 'HIGH'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];


export const TASK_STATUSES = ['TO DO', 'IN PROGRESS', 'DONE'] as const;
export type TaskStatus =
  | (typeof TASK_STATUSES)[number]
  | 'TO_DO'
  | 'IN_PROGRESS';

export const TASK_STATUSES_OPTIONS = TASK_STATUSES.map((ts) => ({
  value: ts.replace(' ', '_'),
  label: ts,
}));

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

export type NoTUpdatableTaskFields =
  | 'id'
  | 'taskOrder'
  | 'version'
  | 'createdBy'
  | 'updatedBy';
export type TaskForm = Omit<Task, NoTUpdatableTaskFields>;



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
    version: number,
    task: TaskForm,
  ): Observable<Task | null | undefined>;

  abstract post(task: TaskForm): Observable<Task | null | undefined>;

  abstract delete(
    id: number,
    version: number,
  ): Observable<Task | null | undefined>;

  abstract drag(dragTask: DragTask): Observable<Task | null | undefined>;
}
