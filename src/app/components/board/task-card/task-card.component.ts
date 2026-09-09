import { Component, computed, input, output, signal } from '@angular/core';
import {
  BADGE_COLOR_MAP,
  TASK_STATUSES,
  Task,
} from '@service/abstract.task.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SlicePipe } from '@angular/common';
import { AvatarComponent } from '@components/shared/avatar/avatar.component';
import { AvatarGroupComponent } from '@components/shared/avatar-group/avatar-group.component';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
} from '@ionic/angular';

import { createOutline, ellipsisVertical, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-task-card',
  imports: [
    AvatarComponent,
    IonIcon,
    AvatarGroupComponent,
    MatTooltipModule,
    SlicePipe,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonButton,
    IonCardHeader,
    IonPopover,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
  ],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  menuOpen = signal(false);
  menuEvent = signal<Event | null>(null);
  trashOutlineIcon = trashOutline;
  createOutlineIcon = createOutline;
  ellipsisVerticalCircleIcon = ellipsisVertical;

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

  openMenu(event: Event) {
    this.menuEvent.set(event);
    this.menuOpen.set(true);
  }
}
