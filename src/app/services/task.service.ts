import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AbstractTaskService, Task } from './abstract.task.service';

@Injectable({
  providedIn: "root",
})
export class TaskService extends AbstractTaskService {
  public http = inject(HttpClient);

  override get(
    description: string,
    column?: string[],
    order?: string,
    limit?: number,
    offset?: number
  ): Observable<Task[]> {
    return this.http.get<Task[]>("tasks", {
      params: {
        description,
        column: column ?? ["id"],
        order: order ?? "desc",
        limit: limit ?? 20,
        offset: offset ?? 0,
      },
    });
  }

  override getById(id: number): Observable<Task> {
    return this.http.get<Task>("tasks/" + id);
  }

  override put(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>("tasks/" + id, task);
  }

  override patch(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>("tasks/" + id, task);
  }

  override post(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>("tasks", task);
  }

  override delete(id: number): Observable<Task> {
    return this.http.delete<Task>("tasks/" + id);
  }
}


