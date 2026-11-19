import { Component, ComponentRef, computed, input, output, signal } from '@angular/core';
import { BADGE_COLOR_MAP, TASK_STATUSES, Task } from '@service/abstract.task.service';
import { SlicePipe } from '@angular/common';

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
  BadgeComponent,
  AvatarComponent,
  AvatarGroupComponent,
} from 'cica-ui';
import { SvgIconDirective } from '@components/shared/svg-icon.directive';

@Component({
  selector: 'app-task-card',
  imports: [
    AvatarGroupComponent,
    AvatarComponent,
    SlicePipe,
    TooltipDirective,
    ModalDirective,
    ListComponent,
    ListItemComponent,
    CardComponent,
    MenuButtonComponent,
    BadgeComponent,
    SvgIconDirective,
    SlicePipe,
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
  isOpen = signal(false);
  protected selectedUser = signal<User | null>(null);
  protected userPopoverOpen = signal(false);
  protected menuEvent = signal<Event | null>(null);
  protected userMenuEvent = signal<Event | null>(null);
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

  deleteTask(): void {
    this.onDelete.emit({ task: this.task(), modal: this.modal! });
  }
}
