import { KeyValue } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../services/abstract.task.service';

@Pipe({
  name: 'sortTask',
  pure: true,
  standalone: true,
})
export class SortTaskPipe implements PipeTransform {
  keys = ['TO_DO', 'IN_PROGRESS', 'DONE'];

  transform(
    array: KeyValue<string, Task[]>[] | null
  ): KeyValue<string, Task[]>[] | null {
    if (!array) {
      return array;
    }
    return array.sort((a, b) => {
      return this.keys.indexOf(a.key) - this.keys.indexOf(b.key);
    });
  }
}
