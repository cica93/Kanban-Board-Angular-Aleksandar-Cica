import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { AbstractTaskService, DragTask, Task } from './abstract.task.service';

@Injectable({
  providedIn: 'root',
})
export class TaskGraphQlService extends AbstractTaskService {
  constructor(private apollo: Apollo) {
    super();
  }

  GET_TASKS_QUERY = gql`
    query getTasks($description: String, $limit: Int!, $offset: Int!) {
      getTasks(description: $description, limit: $limit, offset: $offset) {
        id
        title
        description
        taskStatus
        taskPriority
        version
        users {
          id
          fullName
          email
        }
      }
    }
  `;

  GET_TASK_BY_ID_QUERY = gql`
    query getTaskById($id: Int!) {
      getTaskById(id: $id) {
        id
        title
        description
        taskStatus
        taskPriority
        version
        users {
          id
          fullName
          email
        }
      }
    }
  `;

  override getById(id: number): Observable<Task> {
    return this.apollo
      .watchQuery({
        query: this.GET_TASK_BY_ID_QUERY,
        variables: {
          id,
        },
      })
      .valueChanges.pipe(map((result: any) => result.data.getTaskById));
  }

  override get(description = '', limit = 20, offset = 0): Observable<Task[]> {
    return this.apollo
      .watchQuery({
        query: this.GET_TASKS_QUERY,
        variables: {
          description,
          limit,
          offset,
        },
      })
      .valueChanges.pipe(map((result: any) => result.data.getTasks));
  }

  override put(
    id: number,
    task: Partial<Task>,
  ): Observable<Task | null | undefined> {
    return this.apollo
      .mutate<Task>({
        mutation: gql`
          mutation updateTask($id: Int!, $task: TaskInput!) {
            updateTask(id: $id, task: $task) {
              id
              title
              description
              taskStatus
              taskPriority
              version
              users {
                id
                fullName
                email
              }
            }
          }
        `,
        variables: {
          task,
          id,
        },
      })
      .pipe(map((r: MutationResult<Task>) => r.data));
  }

  override post(task: Partial<Task>): Observable<Task | null | undefined> {
    return this.apollo
      .mutate<Task>({
        mutation: gql`
          mutation createTask($task: TaskInput!) {
            createTask(task: $task) {
              id
              title
              description
              taskStatus
              taskPriority
              version
              users {
                id
                fullName
                email
              }
            }
          }
        `,
        variables: {
          task,
        },
      })
      .pipe(map((r: MutationResult<Task>) => r.data));
  }

  delete(id: number, version: number): Observable<Task | null | undefined> {
    return this.apollo
      .mutate<Task>({
        mutation: gql`
          mutation deleteTask($id: Int!, $version: Int!) {
            deleteTask(id: $id, version: $version) {
              id
              version
            }
          }
        `,
        variables: {
          id,
          version,
        },
      })
      .pipe(
        map((r: MutationResult<Task>) => {
          if (r.errors?.length) {
            return null;
          }
          return r.data ?? null;
        }),
      );
  }

  override drag(dragTask: DragTask): Observable<DragTask | null | undefined> {
    return this.apollo
      .mutate<DragTask>({
        mutation: gql`
          mutation dragTask($dragTask: DragTaskInput!) {
            dragTask(dragTask: $dragTask) {
              id
            }
          }
        `,
        variables: {
          dragTask,
        },
      })
      .pipe(
        map((r: MutationResult<DragTask>) => {
          if (r.errors?.length) {
            return null;
          }
          return r.data ?? null;
        }),
      );
  }
}
