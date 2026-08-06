import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Observable, Subject } from 'rxjs';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { GroupAndSortTaskPipe } from '../../pipes/group-and-sort-task.pipe';
import { ReplacePipe } from '../../pipes/replace.pipe';
import { DebounceInputDirective } from '../../directives/debounce-input.directive';
import {
  AbstractTaskService,
  Task,
  TASK_STATUSES,
  TaskStatus,
} from '@service/abstract.task.service';
import { Router } from '@angular/router';
import { TaskCardComponent } from '@components/board/task-card/task-card.component';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { AutoFocusModule } from 'primeng/autofocus';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
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

@Component({
  selector: 'app-board',
  imports: [
    CardModule,
    InputTextModule,
    GroupAndSortTaskPipe,
    ReplacePipe,
    DebounceInputDirective,
    TaskCardComponent,
    InputIcon,
    IconField,
    Button,
    AutoFocusModule,
    ProgressSpinnerModule,
    DragDropModule,
    FetchDataDirective,
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
  loading = signal(false);
  TASK_STATUSES = [...TASK_STATUSES];
  searchChange = new Subject<string>();
  scrollToBottom = new Subject<unknown>();
  tasks: Task[] = [];
  search = '';

  private readonly taskService = inject(AbstractTaskService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageHandlerService);
  private readonly cdr = inject(ChangeDetectorRef);

  deleteTask(task: Task): void {
    this.taskService.delete(task.id, task.version).subscribe({
      next: () => {
        this.showMessage('Task deleted');
      },
    });
  }

  navigateToTaskDialog(task?: Partial<Task>): void {
    this.router.navigate(
      [
        {
          outlets: {
            sidebar: ['task-dialog'],
          },
        },
      ],
      {
        state: {
          initValue: task ?? {},
        },
        replaceUrl: true,
      },
    );
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
