import { Component, computed, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import {
  BADGE_COLOR_MAP,
  TASK_STATUSES,
  Task,
} from '@service/abstract.task.service';
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
  TASK_STATUSES = TASK_STATUSES;
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
    return BADGE_COLOR_MAP[this.task().taskPriority];
    // const p = this.task().taskPriority;
    // switch (p) {
    //   case TASK_PRIORITIES[0]:
    //     return TASK_STATUSES[0];
    //   case TASK_PRIORITIES[1]:
    //     return TASK_STATUSES[1];
    //   case TASK_PRIORITIES[2]:
    //     return TASK_STATUSES[2];
    //   default:
    //     throw new Error(`invalid priority ${p satisfies never}`);
    // }
  });
}