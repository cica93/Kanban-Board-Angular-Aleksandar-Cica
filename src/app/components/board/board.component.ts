import {
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { GroupAndSortTaskPipe } from '../../pipes/group-and-sort-task.pipe';
import { ReplacePipe } from '../../pipes/replace.pipe';
import {
  AbstractTaskService,
  Task,
  TASK_STATUSES,
  TaskStatus,
} from '@service/abstract.task.service';
import { TaskCardComponent } from '@components/board/task-card/task-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MessageHandlerService } from '@service/message.handler.service';
import {
  FETCH_DATA,
  FetchDataDirective,
} from 'src/app/directives/fetch-data.directive';
import { BecomeVisibleDirective } from 'src/app/directives/become-visible-directive';
import { SearchInputComponent } from '@components/shared/search-input/search-input.component';
import { HeaderComponent } from '@components/shared/header/header.component';
import { ScrollTopComponent } from '@components/shared/scroll-top/scroll-top.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {
  BaseDialogComponent,
  FORM_TOKEN,
} from '@components/shared/base-dialog/base-dialog.component';
import { TaskFormComponent } from './task-card/task-form/task-form.component';

@Component({
  selector: 'app-board',
  imports: [
    GroupAndSortTaskPipe,
    TaskCardComponent,
    MatButtonModule,
    MatIcon,
    MatProgressSpinnerModule,
    DragDropModule,
    ReplacePipe,
    FetchDataDirective,
    BecomeVisibleDirective,
    SearchInputComponent,
    HeaderComponent,
    ScrollTopComponent,
  ],
  templateUrl: './board.component.html',
  providers: [
    {
      provide: FETCH_DATA,
      deps: [AbstractTaskService],
      useFactory:
        (taskService: AbstractTaskService) => (filter: any, slot: number) =>
          taskService.get(filter, 5, slot * 5),
    },
  ],
})
export class BoardComponent {
  offset = 0;
  filter = '';
  limit = 5;
  hasMoreTasks = true;
  tasks$!: Observable<Task[]>;
  showModal = signal<boolean>(false);
  initSaerchValue = signal<string | null>('');
  loading = signal(false);
  TASK_STATUSES_VALUE = [...TASK_STATUSES].map((e) => e.value);
  tasks: Task[] = [];
  becomeVisible = viewChild.required<BecomeVisibleDirective>(
    BecomeVisibleDirective,
  );

  private readonly taskService = inject(AbstractTaskService);
  private readonly messageService = inject(MessageHandlerService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);

  deleteTask(task: Task): void {
    const dialog = this.dialog.open(BaseDialogComponent, {
      data: {
        textContent: 'Are you sure that you want to delete task?',
        dialogHeader: 'Delete task',
        submitLabel: 'Delete',
      },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.delete(task.id, task.version).subscribe({
          next: () => {
            this.showMessage('Task deleted');
            this.initNewSaerch();
          },
        });
      }
    });
  }

  openTaskDialog(task?: Partial<Task>): void {
    const dialog = this.dialog.open(BaseDialogComponent, {
      data: {
        initValue: task,
        dialogHeader: task ? 'Edit task' : 'Create task',
      },
      injector: Injector.create({
        providers: [
          { provide: AbstractTaskService, useValue: this.taskService },
          { provide: FORM_TOKEN, useValue: TaskFormComponent },
        ],
      }),
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.initNewSaerch();
      }
    });
  }

  private initNewSaerch() {
    this.initSaerchValue.update((t) => (t === null ? '' : null));
  }

  onDrop(
    event: CdkDragDrop<{
      key: TaskStatus;
      value: Task[];
    }>,
  ): void {
    const task = event.item.data;
    const taskStatus = event.container.data.key;
    const taskOrder = event.currentIndex;

    this.taskService
      .drag({
        taskId: task.id,
        taskStatus,
        taskOrder,
        taskVersion: task.version,
      })
      .subscribe({
        next: () => {
          this.showMessage('Task status changed');
          if (event.previousContainer === event.container) {
            moveItemInArray(task, event.previousIndex, event.currentIndex);
          } else {
            transferArrayItem(
              event.previousContainer.data.value,
              event.container.data.value,
              event.previousIndex,
              event.currentIndex,
            );
          }
          this.cdr.detectChanges();
        },
      });
  }

  private showMessage(summary: string): void {
    this.messageService.successEvent.next({
      summary,
      detail: 'Task status changed successfully',
    });
  }
}
