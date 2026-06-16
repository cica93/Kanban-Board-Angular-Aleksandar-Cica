import { Pipe, PipeTransform } from '@angular/core';
import {
  Task,
  TASK_STATUSES,
  TaskStatus,
} from '../services/abstract.task.service';

@Pipe({
  name: 'groupAndSortTask',
  pure: true,
})
export class GroupAndSortTaskPipe implements PipeTransform {
  transform(tasks?: Task[] | null): { key: TaskStatus; value: Task[] }[] {
    const tasksByStatus = TASK_STATUSES.reduce(
      (acc, status) => {
        acc[status] = [];
        return acc;
      },
      {} as Record<TaskStatus, Task[]>,
    );
    (tasks ?? []).forEach((task) => {
      tasksByStatus[task.taskStatus].push(task);
    });
    return TASK_STATUSES.map((key) => ({
      key,
      value: tasksByStatus[key].sort((a, b) => a.taskOrder - b.taskOrder),
    }));
  }
}
