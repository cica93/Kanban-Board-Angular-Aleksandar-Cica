import { Component, computed, input, output } from '@angular/core';
import {
  BADGE_COLOR_MAP,
  TASK_STATUSES,
  Task,
} from '@service/abstract.task.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SlicePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AvatarComponent } from '@components/shared/avatar/avatar.component';
import { AvatarGroupComponent } from '@components/shared/avatar-group/avatar-group.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-card',
  imports: [
    MatCardModule,
    AvatarComponent,
    AvatarGroupComponent,
    MatTooltipModule,
    SlicePipe,
    MatBadgeModule,
    MatIcon,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  protected readonly maxVisibleImages = 5;
  TASK_STATUSES = TASK_STATUSES;
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
