import { __decorate } from "tslib";
import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';
import { AbstractTaskService, } from './abstract.task.service';
let TaskGraphQlService = class TaskGraphQlService extends AbstractTaskService {
    apollo = inject(Apollo);
    constructor() {
        super();
    }
    GET_TASKS_QUERY = gql `
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
    GET_TASK_BY_ID_QUERY = gql `
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
    getById(id) {
        return this.apollo
            .query({
            query: this.GET_TASK_BY_ID_QUERY,
            variables: {
                id,
            },
        })
            .pipe(map((result) => result.data.getTaskById));
    }
    get(description = '', limit = 20, offset = 0) {
        return this.apollo
            .query({
            query: this.GET_TASKS_QUERY,
            variables: {
                description: description === null ? '' : description,
                limit,
                offset,
            },
        })
            .pipe(map((result) => result.data?.getTasks ?? []));
    }
    put(id, version, task) {
        return this.apollo
            .mutate({
            mutation: gql `
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
    post(task) {
        return this.apollo
            .mutate({
            mutation: gql `
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
    delete(id, version) {
        return this.apollo
            .mutate({
            mutation: gql `
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
    drag(dragTask) {
        return this.apollo
            .mutate({
            mutation: gql `
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
};
TaskGraphQlService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], TaskGraphQlService);
export { TaskGraphQlService };
//# sourceMappingURL=task.graphql.service.js.map