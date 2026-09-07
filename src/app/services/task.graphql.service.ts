import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import {
  AbstractTaskService,
  DragTask,
  Task,
  TasksByStatus,
  TasksByStatusAndTypeName,
} from './abstract.task.service';
import { User } from './user.service';

type UserWithTypeName = User & { __typename: string };

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
        status
        tasks {
          id
          title
          description
          taskStatus
          taskPriority
          version
          createdBy
          updatedBy
          taskOrder
          users {
            id
            fullName
            email
            image
          }
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
          image
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
    description = '',
    limit = 20,
    offset = 0,
  ): Observable<TasksByStatus[]> {
    return this.apollo
      .watchQuery<{ getTasks: TasksByStatusAndTypeName[] }>({
        query: this.GET_TASKS_QUERY,
        variables: {
          description: description === null ? '' : description,
          limit,
          offset,
        },
      })
      .valueChanges.pipe(
        map(
          (result) =>
            (result.data?.getTasks ?? []).map((e) => ({
              status: e.status,
              tasks: e.tasks?.map((task) => {
                const { __typename, ...input } = task;
                const users = this.extractUserName(
                  input.users as unknown as UserWithTypeName[],
                );
                return { ...input, users };
              }),
            })) as TasksByStatus[],
        ),
      );
  }

  private extractUserName(users: UserWithTypeName[]): User[] {
    return users.map((user) => {
      const { __typename, ...userInput } = user;
      return { ...userInput, password: 'defaultPassword' };
    });
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
    task.version = 0;
    task.createdBy = 'default@gmail.com';
    task.updatedBy = 'defaulT@gmail.com';
    task.taskOrder = 0;
    return this.apollo
      .mutate<Task>({
        mutation: gql`
          mutation createTask($task: TaskInput!) {
            createTask(task: $task) {
              id
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
