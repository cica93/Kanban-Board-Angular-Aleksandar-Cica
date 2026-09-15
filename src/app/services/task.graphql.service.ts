import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
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
export class TaskGraphQlService extends AbstractTaskService {
  private readonly apollo = inject(Apollo);
  constructor() {
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
      .query({
        query: this.GET_TASK_BY_ID_QUERY,
        variables: {
          id,
        },
      })
      .pipe(map((result: any) => result.data.getTaskById));
  }

  override get(description = '', limit = 20, offset = 0): Observable<TasksByStatus[]> {
    return this.apollo
      .query<{
        getTasks: TasksByStatus[];
      }>({
        query: this.GET_TASKS_QUERY,
        variables: {
          description: description === null ? '' : description,
          limit,
          offset,
        },
      })
      .pipe(map((result) => result.data?.getTasks ?? []));
  }

  override put(id: number, version: number, task: TaskForm): Observable<Task | null | undefined> {
    return this.apollo
      .mutate<{ updateTask: Task }>({
        mutation: gql`
          mutation updateTask($id: Int!, $version: Int!, $task: TaskModifyInput!) {
            updateTask(id: $id, version: $version, task: $task) {
              id
              title
              description
              taskStatus
              taskPriority
              version
              taskOrder
              users {
                id
                fullName
                image
              }
            }
          }
        `,
        variables: {
          id,
          version,
          task,
        },
      })
      .pipe(map((r) => r.data?.updateTask));
  }

  override post(task: TaskForm): Observable<Task | null | undefined> {
    console.log(task);
    return this.apollo
      .mutate<{ createTask: Task }>({
        mutation: gql`
          mutation createTask($task: TaskModifyInput!) {
            createTask(task: $task) {
              id
              title
              description
              taskStatus
              taskPriority
              version
              taskOrder
              users {
                id
                fullName
                image
              }
            }
          }
        `,
        variables: {
          task,
        },
      })
      .pipe(map((r) => r.data?.createTask));
  }

  delete(id: number, version: number): Observable<Task | null | undefined> {
    return this.apollo
      .mutate<{ deleteTask: Task }>({
        mutation: gql`
          mutation deleteTask($id: Int!, $version: Int!) {
            deleteTask(id: $id, version: $version) {
              id
              title
              description
              taskStatus
              taskPriority
              taskOrder
              version
              users {
                id
                fullName
                image
              }
            }
          }
        `,
        variables: {
          id,
          version,
        },
      })
      .pipe(map((r) => r.data?.deleteTask));
  }

  override drag(dragTask: DragTask): Observable<Task | null | undefined> {
    return this.apollo
      .mutate<{ dragTask: Task }>({
        mutation: gql`
          mutation dragTask($dragTask: DragTaskInput!) {
            dragTask(dragTask: $dragTask) {
              id
              title
              description
              taskStatus
              taskPriority
              taskOrder
              version
              users {
                id
                fullName
                image
              }
            }
          }
        `,
        variables: {
          dragTask,
        },
      })
      .pipe(map((r) => r.data?.dragTask));
  }
}
