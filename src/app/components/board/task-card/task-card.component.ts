import { Component, computed, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BADGE_COLOR_MAP, Task } from '../../../services/abstract.task.service';
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
  taskSeverityClass = computed(() => BADGE_COLOR_MAP[this.task().taskPriority]);
}