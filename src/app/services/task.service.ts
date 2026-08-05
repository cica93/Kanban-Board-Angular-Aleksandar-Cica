import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AbstractTaskService, DragTask, Task } from './abstract.task.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService extends AbstractTaskService {
  private readonly http = inject(HttpClient);

  override get(description = '', limit = 20, offset = 0): Observable<Task[]> {
    return this.http.get<Task[]>('tasks', {
      params: {
        description,
        limit,
        offset,
      },
    });
  }

  override getById(id: number): Observable<Task> {
    return this.http.get<Task>('tasks/' + id);
  }

  override put(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>('tasks/' + id, task);
  }

  override post(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>('tasks', task);
  }

  override delete(id: number, version: number): Observable<Task> {
    return this.http.delete<Task>('tasks/' + id + '/' + version);
  }

  override drag(dragTask: DragTask): Observable<DragTask> {
    return this.http.put<DragTask>('tasks/drag', dragTask);
  }
}


