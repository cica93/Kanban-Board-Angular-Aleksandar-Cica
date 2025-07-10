import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';

import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import {
  debounceTime,
  exhaustMap,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  scan,
  startWith,
  Subject,
  tap,
} from 'rxjs';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SortTaskPipe } from '../../pipes/sort-task.pipe';
import { ReplacePipe } from '../../pipes/replace.pipe';
import { DebounceInputDirective } from '../debounce-input.directive';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {
  AbstractTaskService,
  Task,
} from '../../services/abstract.task.service';
import { NavigationEnd, Router, Event } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DragDropModule } from 'primeng/dragdrop';
import { TaskCardComponent } from './task-card/task-card.component';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Location } from '@angular/common';
import { AutoFocusModule } from 'primeng/autofocus';

export interface TaskResponse {
  event: string | { event: string };
  data: Task[];
}

@Component({
  selector: 'app-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    CardModule,
    KeyValuePipe,
    InputTextModule,
    SortTaskPipe,
    ReplacePipe,
    DebounceInputDirective,
    DragDropModule,
    ToastModule,
    TaskCardComponent,
    Button,
    TooltipModule,
    InputIcon,
    IconField,
    AutoFocusModule,
  ],
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  offset = 0;
  filter = '';
  limit = 20;
  hasMoreTasks = true;
  tasks$!: Observable<{ [key: string]: Task[] }>;
  showModal = signal<boolean>(false);
  taskId: number | undefined;

  searchChange = new Subject<string>();
  scrollToBottom = new Subject<unknown>();

  constructor(
    private taskService: AbstractTaskService,
    private messageService: MessageService,
    private router: Router,
    private location: Location
  ) {}

  draggedTaskId: number | undefined;

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e: Event): e is NavigationEnd => {
          if (!(e instanceof NavigationEnd)) return false;
          const urlTree = this.router.parseUrl(e.urlAfterRedirects);
          const outlets = urlTree.root.children;
          return (
            !outlets['sidebar'] &&
            (this.location.getState() as any)?.['initNewSearch']
          );
        })
      )
      .subscribe(() => {
        this.searchChange.next('');
      });

    this.tasks$ = merge(
      fromEvent(window, 'scroll').pipe(
        filter(() => {
          const threshold = 100;
          const position = window.innerHeight + window.scrollY;
          const height = document.body.offsetHeight;
          return height - position <= threshold && this.hasMoreTasks;
        }),
        debounceTime(200),
        tap(() => (this.offset += this.limit)),
        map(() => ({ event: 'scroll' }))
      ),
      this.searchChange.pipe(
        startWith(''),
        tap((e: string) => {
          this.offset = 0;
          this.filter = e;
        })
      )
    )
      .pipe(
        exhaustMap((value: string | { event: string }) =>
          this.taskService
            .get(this.filter, ['id'], 'desc', this.limit, this.offset)
            .pipe(map((data) => ({ event: value, data } as TaskResponse)))
        )
      )
      .pipe(
        scan((acc: TaskResponse, next: TaskResponse) => {
          this.hasMoreTasks = next.data.length == this.limit;
          if (typeof next.event === 'string') {
            return next;
          }
          return {
            data: [...acc.data, ...next.data],
            event: next.event,
          } as TaskResponse;
        }),
        map((taskResponse: TaskResponse) => {
          const r: { [key: string]: Task[] } = {};
          taskResponse.data.forEach((e: Task) => {
            if (r[e.taskStatus]) {
              r[e.taskStatus].push(e);
            } else {
              r[e.taskStatus] = [e];
            }
          });
          return r;
        })
      );
  }

  deleteTask(taskId: number): void {
    this.taskService.delete(taskId).subscribe({
      next: () => {
        this.searchChange.next('');
        this.messageService.add({
          severity: 'success',
          key: 'main',
          closable: true,
          summary: 'Task deleted',
        });
      },
    });
  }

  handleDrop(taskStatus: string): void {
    this.taskService.patch(this.draggedTaskId!, { taskStatus }).subscribe({
      next: () => {
        this.searchChange.next('');
      },
    });
  }

  navigateUserDialog(task: Partial<Task>): void {
    this.router.navigate(
      [
        {
          outlets: {
            sidebar: ['user-dialog'],
          },
        },
      ],
      { state: { initValue: task } }
    );
  }
}


