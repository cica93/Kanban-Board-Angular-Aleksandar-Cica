import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskStatus } from '../services/abstract.task.service';

@Pipe({
  name: 'groupAndSortTask',
  pure: true,
  standalone: true,
})
export class GroupAndSortTaskPipe implements PipeTransform {
  transform(
    tasks: Task[] | null | undefined,
  ): { key: TaskStatus; value: Task[] }[] {
    const tasksByStatus: Record<TaskStatus, Task[]> = {
      TO_DO: [],
      IN_PROGRESS: [],
      DONE: [],
    };
    if (!tasks) {
      return this.convertToKeyValuePairs(tasksByStatus);
    }
    tasks.forEach((task) => {
      tasksByStatus[task.taskStatus].push(task);
    });
    return this.convertToKeyValuePairs(tasksByStatus);
  }

  private convertToKeyValuePairs(
    tasks: Record<TaskStatus, Task[]>,
  ): { key: TaskStatus; value: Task[] }[] {
    return [
      {
        key: 'TO_DO',
        value: tasks.TO_DO.sort((a, b) => a.taskOrder - b.taskOrder),
      },
      {
        key: 'IN_PROGRESS',
        value: tasks.IN_PROGRESS.sort((a, b) => a.taskOrder - b.taskOrder),
      },
      {
        key: 'DONE',
        value: tasks.DONE.sort((a, b) => a.taskOrder - b.taskOrder),
      },
    ];
  }
}
