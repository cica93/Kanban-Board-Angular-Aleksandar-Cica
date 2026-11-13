import { __decorate } from "tslib";
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractTaskService, } from './abstract.task.service';
let TaskService = class TaskService extends AbstractTaskService {
    http = inject(HttpClient);
    baseUrl = 'tasks';
    getTableResponse(filter = '', limit = 20, offset = 0, sortColumn = 'id', direction = 'desc') {
        return this.http.get(`${this.baseUrl}/getTableResponse`, {
            params: {
                filter,
                limit,
                offset,
                sortColumn,
                direction,
            },
        });
    }
    get(description = '', limit = 20, offset = 0) {
        return this.http.get(this.baseUrl, {
            params: {
                description: description ?? '',
                limit,
                offset,
            },
        });
    }
    getById(id) {
        return this.http.get(`${this.baseUrl}/${id}`);
    }
    put(id, version, task) {
        return this.http.put(`${this.baseUrl}/${id}/${version}`, task);
    }
    post(task) {
        return this.http.post(this.baseUrl, task);
    }
    delete(id, version) {
        return this.http.delete(`${this.baseUrl}/${id}/${version}`);
    }
    drag(dragTask) {
        return this.http.put(`${this.baseUrl}/drag`, dragTask);
    }
};
TaskService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], TaskService);
export { TaskService };
//# sourceMappingURL=task.service.js.map