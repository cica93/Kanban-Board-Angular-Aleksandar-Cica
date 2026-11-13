import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
import { TASK_STATUSES } from '@service/abstract.task.service';
let GroupAndSortTaskPipe = class GroupAndSortTaskPipe {
    transform(tasks) {
        const tasksByStatus = TASK_STATUSES.reduce((acc, status) => {
            acc[status] = [];
            return acc;
        }, {});
        (tasks ?? []).forEach((task) => {
            tasksByStatus[task.taskStatus].push(task);
        });
        return TASK_STATUSES.map((key) => ({
            key: key,
            value: tasksByStatus[key].sort((a, b) => a.taskOrder - b.taskOrder),
        }));
    }
};
GroupAndSortTaskPipe = __decorate([
    Pipe({
        name: 'groupAndSortTask',
        pure: true,
    })
], GroupAndSortTaskPipe);
export { GroupAndSortTaskPipe };
//# sourceMappingURL=group-and-sort-task.pipe.js.map