import { Component, computed, input, output, signal } from '@angular/core';
import { BADGE_COLOR_MAP, TASK_STATUSES, Task } from '@service/abstract.task.service';
import { SlicePipe } from '@angular/common';
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
  IonAvatar,
} from '@ionic/angular';

import { createOutline, ellipsisVertical, trashOutline } from 'ionicons/icons';
import { User } from '@service/user.service';
import { TooltipDirective } from 'src/app/directives/tooltip.directive';

@Component({
  selector: 'app-task-card',
  imports: [
    IonIcon,
    AvatarGroupComponent,
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
    IonAvatar,
    TooltipDirective,
  ],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  public menuOpen = signal(false);
  protected selectedUser = signal<User | null>(null);
  protected userPopoverOpen = signal(false);
  protected menuEvent = signal<Event | null>(null);
  protected userMenuEvent = signal<Event | null>(null);
  protected trashOutlineIcon = trashOutline;
  protected createOutlineIcon = createOutline;
  protected ellipsisVerticalCircleIcon = ellipsisVertical;
  protected readonly maxVisibleImages = 5;
  protected TASK_STATUSES = TASK_STATUSES;
  readonly task = input.required<Task>();
  readonly onDelete = output<Task>();
  readonly onEdit = output<Task>();
  protected readonly taskSeverityClass = computed(() => {
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

  constructor() {}

  openMenu(event: Event) {
    this.menuEvent.set(event);
    this.menuOpen.set(true);
  }

  openUserMenu(event: Event, user: User) {
    this.selectedUser.set(user);
    this.userMenuEvent.set(event);
    this.userPopoverOpen.set(true);
  }

  closeUserMenu(): void {
    this.userPopoverOpen.set(true);
  }
}
