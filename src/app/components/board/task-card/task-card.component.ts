import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from "@angular/core";
import { CardModule } from "primeng/card";
import { Task } from "../../../services/abstract.task.service";
import { BadgeModule } from "primeng/badge";
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { TooltipModule } from "primeng/tooltip";
import { Menu } from "primeng/menu";
import { ButtonModule } from "primeng/button";
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-task-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CardModule,
    BadgeModule,
    AvatarModule,
    TooltipModule,
    AvatarGroupModule,
    Menu,
    ButtonModule,
    SlicePipe,
  ],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  items = [
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
  @Output() onDelete = new EventEmitter<Task>();
  @Output() onEdit = new EventEmitter<Task>();
}
