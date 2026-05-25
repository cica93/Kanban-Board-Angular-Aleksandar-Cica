import { Component, computed, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Task, TASK_PRIORITIES } from '../../../services/abstract.task.service';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TooltipModule } from 'primeng/tooltip';
import { SlicePipe } from '@angular/common';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-task-card',
  imports: [
    CardModule,
    BadgeModule,
    AvatarModule,
    TooltipModule,
    AvatarGroupModule,
    SlicePipe,
    MenuModule,
  ],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  protected readonly maxVisibleImages = 5;
  TASK_PRIORITIES = TASK_PRIORITIES;
  protected readonly items = [
    {
      items: [
        {
          label: 'Edit',
          icon: 'pi pi-pencil',
          command: () => {
            this.onEdit.emit(this.task());
          },
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          command: () => {
            this.onDelete.emit(this.task());
          },
        },
      ],
    },
  ];
  readonly task = input.required<Task>();
  readonly onDelete = output<Task>();
  readonly onEdit = output<Task>();
  taskSeverityClass = computed(() => {
    switch (this.TASK_PRIORITIES.indexOf(this.task().taskPriority)) {
      case 0:
        return 'info';
      case 1:
        return 'warn';
      case 2:
        return 'danger';
      default:
        throw new Error('Invalid task priority');
    }
  });
}
