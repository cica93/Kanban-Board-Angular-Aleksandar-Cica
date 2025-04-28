import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { map, Observable, of } from 'rxjs';
import { AbstractTaskService, Task } from './abstract.task.service';

@Injectable({
  providedIn: "root",
})
export class TaskGraphQlService extends AbstractTaskService {
  constructor(private apollo: Apollo) {
    super();
  }

  GET_TASKS_QUERY = gql`
    query getTasks(
      $page: Int!
      $pageSize: Int!
      $columns: [String!]
      $order: String
      $description: String
    ) {
      getTasks(
        page: $page
        pageSize: $pageSize
        columns: $columns
        order: $order
        description: $description
      ) {
        id
        title
        description
        taskStatus
        taskPriority
        users {
          id
          fullName
          email
        }
      }
    }
  `;

  GET_TASK_BY_ID_QUERY = gql`
    query getTaskById($id: ID!) {
      getTaskById(id: $id) {
        id
        title
        description
        taskStatus
        taskPriority
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

  override get(
    description = "",
    columns: ["id"],
    order = "desc",
    limit = 20,
    offset = 0
  ): Observable<Task[]> {
    return this.apollo
      .watchQuery({
        query: this.GET_TASKS_QUERY,
        variables: {
          page: offset / limit,
          pageSize: limit,
          columns,
          order,
          description,
        },
      })
      .valueChanges.pipe(map((result: any) => result.data.getTasks));
  }

  override put(
    id: number,
    task: Partial<Task>
  ): Observable<Task | null | undefined> {
    console.log(task);
    return this.apollo
      .mutate<Task>({
        mutation: gql`
          mutation updateTask($id: ID!, $task: TaskInput!) {
            updateTask(id: $id, task: $task) {
              id
              title
              description
              taskStatus
              taskPriority
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
  override patch(
    id: number,
    task: Partial<Task>
  ): Observable<Task | null | undefined> {
    return of(null);
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
            }
          }
        `,
        variables: {
          task,
        },
      })
      .pipe(map((r: MutationResult<Task>) => r.data));
  }

  delete(id: number): Observable<Task | null | undefined> {
    return this.apollo
      .mutate<Task>({
        mutation: gql`
          mutation deleteTask($id: ID!) {
            deleteTask(id: $id) {
              id
            }
          }
        `,
        variables: {
          id,
        },
      })
      .pipe(map((r: MutationResult<Task>) => r.data));
  }
}
