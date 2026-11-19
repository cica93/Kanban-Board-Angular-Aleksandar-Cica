import { Component, ComponentRef, computed, input, output, signal } from '@angular/core';
import { BADGE_COLOR_MAP, TASK_STATUSES, Task } from '@service/abstract.task.service';
import { SlicePipe } from '@angular/common';
import { AvatarGroupComponent } from '@components/shared/avatar-group/avatar-group.component';

import { createOutline, ellipsisVertical, trashOutline } from 'ionicons/icons';
import { User } from '@service/user.service';
import {
  ListComponent,
  ListItemComponent,
  ModalComponent,
  ModalDirective,
  SUBMIT_FORM_TOKEN_LOAD,
  TooltipDirective,
  MenuButtonComponent,
  CardComponent,
} from 'cica-ui';
import { IonAvatar, IonBadge, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-task-card',
  imports: [
    AvatarGroupComponent,
    SlicePipe,
    TooltipDirective,
    IonAvatar,
    ModalDirective,
    ListComponent,
    IonIcon,
    ListItemComponent,
    IonBadge,
    CardComponent,
    MenuButtonComponent,
  ],
  templateUrl: './task-card.component.html',
  providers: [
    {
      provide: SUBMIT_FORM_TOKEN_LOAD,
      useValue: () =>
        import('../../board/task-card/task-form/task-form.component').then(
          (module) => module.TaskFormComponent,
        ),
    },
  ],
})
export class TaskCardComponent {
  menuOpen = input<boolean>(false);
  menuIsHidden = signal<boolean>(false);
  openMenuEvent = output<void>();
  dismissMenuEvent = output<void>();
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
  readonly onDelete = output<{ task: Task; modal: ComponentRef<ModalComponent> }>();
  modal?: ComponentRef<ModalComponent>;
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
    this.openMenuEvent.emit();
  }

  openUserMenu(event: Event, user: User) {
    this.selectedUser.set(user);
    this.userMenuEvent.set(event);
    this.userPopoverOpen.set(true);
  }

  onCancel(): void {
    this.dismissMenuEvent.emit();
  }

  deleteTask(): void {
    this.onDelete.emit({ task: this.task(), modal: this.modal! });
  }

  modalOpenEvent(event: ComponentRef<ModalComponent>): void {
    this.modal = event;
  }
}
