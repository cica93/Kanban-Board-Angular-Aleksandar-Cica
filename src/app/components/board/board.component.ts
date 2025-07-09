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
import { SecurityService } from '../../services/security.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {
  AbstractTaskService,
  Task,
} from '../../services/abstract.task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DragDropModule } from 'primeng/dragdrop';
import { TaskCardComponent } from './task-card/task-card.component';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

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
    private securityService: SecurityService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
 
  draggedTaskId: number | undefined;

  ngOnInit(): void {
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

  edit(task: Task): void {
    this.navigateUserDialog(task)
  }

  deleteTask(taskId: number): void {
    this.taskService.delete(taskId).subscribe((a: any) => {
      this.searchChange.next('');
      this.messageService.add({
        severity: 'success',
        key: 'main',
        closable: true,
        summary: 'Task deleted',
      });
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
    this.router.navigate([
    {
      outlets: {
        sidebar: ['user-dialog']
      }
    }
  ],{ state: {initValue:task} });
  }
}


