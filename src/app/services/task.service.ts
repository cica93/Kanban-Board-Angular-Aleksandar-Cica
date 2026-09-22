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

  private readonly baseUrl = 'tasks';

  override get(description = '', limit = 20, offset = 0): Observable<TasksByStatus[]> {
    return this.http.get<TasksByStatus[]>(this.baseUrl, {
      params: {
        description: description ?? '',
        limit,
        offset,
      },
    });
  }

  override getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  override put(id: number, version: number, task: TaskForm): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}/${version}`, task);
  }

  override post(task: TaskForm): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  override delete(id: number, version: number): Observable<Task> {
    return this.http.delete<Task>(`${this.baseUrl}/${id}/${version}`);
  }

  override drag(dragTask: DragTask): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/drag`, dragTask);
  }
}
