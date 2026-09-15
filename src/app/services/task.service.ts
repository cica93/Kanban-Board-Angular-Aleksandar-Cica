import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  AbstractTaskService,
  DragTask,
  Task,
  TaskForm,
  TasksByStatus,
} from './abstract.task.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService extends AbstractTaskService {
  private readonly http = inject(HttpClient);

  override get(description = '', limit = 20, offset = 0): Observable<TasksByStatus[]> {
    return this.http.get<TasksByStatus[]>('tasks', {
      params: {
        description: description == null ? '' : description,
        limit,
        offset,
      },
    });
  }

  override getById(id: number): Observable<Task> {
    return this.http.get<Task>(`tasks/${id}`);
  }

  override put(id: number, version: number, task: TaskForm): Observable<Task> {
    return this.http.put<Task>(`tasks/${id}/${version}`, task);
  }

  override post(task: TaskForm): Observable<Task> {
    return this.http.post<Task>('tasks', task);
  }

  override delete(id: number, version: number): Observable<Task> {
    return this.http.delete<Task>(`tasks/${id}/${version}`);
  }

  override drag(dragTask: DragTask): Observable<Task> {
    return this.http.put<Task>('tasks/drag', dragTask);
  }
}
