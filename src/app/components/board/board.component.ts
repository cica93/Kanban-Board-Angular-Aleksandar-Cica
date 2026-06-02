import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import {
  catchError,
  debounceTime,
  exhaustMap,
  filter,
  fromEvent,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { GroupAndSortTaskPipe } from '../../pipes/group-and-sort-task.pipe';
import { ReplacePipe } from '../../pipes/replace.pipe';
import { DebounceInputDirective } from '../debounce-input.directive';
import {
  AbstractTaskService,
  Task,
  TASK_STATUSES,
  TaskStatus,
} from '../../services/abstract.task.service';
import { Router } from '@angular/router';
import { TaskCardComponent } from './task-card/task-card.component';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { AutoFocusModule } from 'primeng/autofocus';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import {
  AppState,
  loadTasks,
  deleteTask,
  appendTasks,
  loadTasksSuccess,
  loadTasksFailure,
  dragTask,
} from '../../store/task-store';
import { Store } from '@ngrx/store';
import { LoadState } from '../../store/load-state';
import { MessageHandlerService } from 'src/app/services/message.handler.service';

export interface TaskResponse {
  event: string | { event: string };
  data: Task[];
}

@Component({
  selector: 'app-board',
  imports: [
    AsyncPipe,
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
  ],
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  offset = 0;
  filter = '';
  limit = 5;
  hasMoreTasks = true;
  tasks$!: Observable<LoadState<Task>>;
  showModal = signal<boolean>(false);
  loading = signal(false);
  TASK_STATUSES = [...TASK_STATUSES];
  searchChange = new Subject<string>();
  scrollToBottom = new Subject<unknown>();

  private readonly taskService = inject(AbstractTaskService);
  private readonly messageHandler = inject(MessageHandlerService);
  private readonly router = inject(Router);
  private readonly store = inject(Store<AppState>);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.store.dispatch(loadTasks());
    this.tasks$ = this.store.select((state: AppState) => state.tasks);
    fromEvent(window, 'scroll')
      .pipe(
        filter(() => {
          const threshold = 100;
          const position = window.innerHeight + window.scrollY;
          const height = document.body.scrollHeight;
          return height - position <= threshold && !!this.hasMoreTasks;
        }),
        debounceTime(200),
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.offset += this.limit;
          window.scrollBy({
            top: -200,
            behavior: 'instant',
          });
        }),
        exhaustMap(() => this.fetchTasks()),
      )
      .subscribe((tasks) => this.store.dispatch(appendTasks({ data: tasks })));

    this.searchChange
      .pipe(
        tap((e) => {
          this.offset = 0;
          this.filter = e;
          this.loading.set(true);
        }),
        startWith(''),
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.fetchTasks()),
      )
      .subscribe((tasks) => {
        this.loading.set(false);
        this.store.dispatch(loadTasksSuccess({ data: tasks }));
      });
  }

  private fetchTasks(): Observable<Task[]> {
    this.store.dispatch(loadTasks());
    return this.taskService
      .get(this.filter, ['id'], 'desc', this.limit, this.offset)
      .pipe(
        catchError((error) => {
          this.store.dispatch(loadTasksFailure(error));
          return of([]);
        }),
      );
  }

  deleteTask(task: Task): void {
    this.taskService.delete(task.id, task.version).subscribe({
      next: () => {
        this.store.dispatch(deleteTask({ task }));
        this.showMessage('Task deleted');
      },
    });
  }

  navigateUserDialog(task?: Partial<Task>): void {
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
          this.store.dispatch(dragTask({ data: task, taskStatus, taskOrder }));
          this.showMessage('Task status changed');
        },
      });
  }

  private showMessage(summary: string): void {
    this.messageHandler.successEvent.next({
      summary,
      detail: 'Task status changed successfully',
    });
  }
}
