import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
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
      .watchQuery<{ getTasks: Task[] }>({
        query: this.GET_TASKS_QUERY,
        variables: {
          description: description === null ? '' : description,
          limit,
          offset,
        },
      })
      .valueChanges.pipe(
        map((result) => (result.data?.getTasks ?? []) as Task[]),
      );
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
      .pipe(map((r) => r.data));
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
      .pipe(map((r) => r.data));
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
        map((r) => {
          return r.data ?? null;
        }),
      );
  }

  override drag({
    taskId,
    taskStatus,
    taskOrder,
    taskVersion,
  }: DragTask): Observable<Task | null | undefined> {
    return this.apollo
      .mutate<Task>({
        mutation: gql`
          mutation dragTask(
            $taskId: Int!
            $taskStatus: String!
            $taskOrder: Int!
            $taskVersion: Int!
          ) {
            dragTask(
              taskId: $taskId
              taskStatus: $taskStatus
              taskOrder: $taskOrder
              taskVersion: $taskVersion
            ) {
              id
              version
            }
          }
        `,
        variables: {
          taskId,
          taskStatus,
          taskOrder,
          taskVersion,
        },
      })
      .pipe(
        map((r) => {
          return r.data ?? null;
        }),
      );
  }
}
