import { __decorate } from "tslib";
import { Component, computed, input, output, signal } from '@angular/core';
import { BADGE_COLOR_MAP, TASK_STATUSES } from '@service/abstract.task.service';
import { SlicePipe } from '@angular/common';
import { AvatarGroupComponent } from '@components/shared/avatar-group/avatar-group.component';
import { IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonLabel, IonList, IonPopover, IonAvatar, } from '@ionic/angular';
import { createOutline, ellipsisVertical, trashOutline } from 'ionicons/icons';
import { TooltipDirective } from '@directives/tooltip.directive';
let TaskCardComponent = class TaskCardComponent {
    menuOpen = input(false);
    openMenuEvent = output();
    dismissMenuEvent = output();
    selectedUser = signal(null);
    userPopoverOpen = signal(false);
    menuEvent = signal(null);
    userMenuEvent = signal(null);
    trashOutlineIcon = trashOutline;
    createOutlineIcon = createOutline;
    ellipsisVerticalCircleIcon = ellipsisVertical;
    maxVisibleImages = 5;
    TASK_STATUSES = TASK_STATUSES;
    task = input.required();
    onDelete = output();
    onEdit = output();
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
    constructor() { }
    openMenu(event) {
        this.menuEvent.set(event);
        this.openMenuEvent.emit();
    }
    openUserMenu(event, user) {
        this.selectedUser.set(user);
        this.userMenuEvent.set(event);
        this.userPopoverOpen.set(true);
    }
    closeUserMenu() {
        this.userPopoverOpen.set(true);
    }
};
TaskCardComponent = __decorate([
    Component({
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
], TaskCardComponent);
export { TaskCardComponent };
//# sourceMappingURL=task-card.component.js.map