import {
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  AbstractTaskService,
  Task,
  TASK_STATUSES,
  TasksByStatus,
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
import { MatDialog } from '@angular/material/dialog';
import {
  BaseDialogComponent,
  FORM_TOKEN,
} from '@components/shared/base-dialog/base-dialog.component';
import { TaskFormComponent } from './task-card/task-form/task-form.component';
import { addIcons } from 'ionicons';
import { IonButton, IonIcon } from '@ionic/angular';
import { add } from 'ionicons/icons';

const limit = 5;

@Component({
  selector: 'app-board',
  imports: [
    TaskCardComponent,
    IonButton,
    IonIcon,
    MatProgressSpinnerModule,
    DragDropModule,
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
          taskService.get(filter, limit, slot * limit),
    },
  ],
})
export class BoardComponent {
  offset = 0;
  filter = '';
  limit = 5;
  hasMoreTasks = true;
  tasks$!: Observable<TasksByStatus>;
  showModal = signal<boolean>(false);
  initSaerchValue = signal<string | null>('');
  loading = signal(false);
  TASK_STATUSES = [...TASK_STATUSES];
  tasks: TasksByStatus[] = [];
  becomeVisible = viewChild.required<BecomeVisibleDirective>(
    BecomeVisibleDirective,
  );

  private readonly taskService = inject(AbstractTaskService);
  private readonly messageService = inject(MessageHandlerService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);

  constructor() {
    addIcons({ add });
  }

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
      height: '100vh',
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

  onDrop(event: CdkDragDrop<Task[]>, status: TaskStatus): void {
    const task = event.item.data;
    const taskStatus = status;
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
              event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex,
            );
          }
          this.cdr.detectChanges();
        },
      });
  }

  accumulatorCallBack(
    acc: TasksByStatus[],
    curr: TasksByStatus[],
  ): TasksByStatus[] {
    return acc.map((e, index) => ({
      status: e.status,
      tasks: [...e.tasks, ...curr[index]!.tasks],
    }));
  }

  hasMoreCallBack(curr: TasksByStatus[]): boolean {
    return curr.some((e) => e.tasks.length === limit);
  }

  private showMessage(summary: string): void {
    this.messageService.successEvent.next({
      summary,
      detail: 'Task status changed successfully',
    });
  }
}
