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
  distinctUntilChanged,
  every,
  exhaustMap,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  scan,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
} from "rxjs";
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SortTaskPipe } from '../../pipes/sort-task.pipe';
import { ReplacePipe } from '../../pipes/replace.pipe';
import { DebounceInputDirective } from '../debounce-input.directive';
import { SecurityService } from '../../services/security.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { User, UserService } from '../../services/user.service';
import { AbstractTaskService, Task } from '../../services/abstract.task.service';
import { RouterLink } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DragDropModule } from 'primeng/dragdrop';

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
    Button,
    ReactiveFormsModule,
    SidebarModule,
    InputTextModule,
    DropdownModule,
    TooltipModule,
    SortTaskPipe,
    ReplacePipe,
    MultiSelectModule,
    DebounceInputDirective,
    ToastModule,
    RouterLink,
    DragDropModule,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  offset = 0;
  filter = '';
  limit = 20;
  hasMoreTasks = true;
  tasks$!: Observable<{ [key: string]: Task[] }>;
  showModal = signal<boolean>(false);
  taskId: number | undefined;
  form!: FormGroup;
  users$!: Observable<User[]>;
  searchChange = new Subject<string>();
  scrollToBottom = new Subject<unknown>();

  constructor(
    private taskService: AbstractTaskService,
    private messageService: MessageService,
    private securityService: SecurityService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}
  taskStatuses = ['TO_DO', 'IN_PROGRESS', 'DONE', 'SOME'];
  taskPriority = ['LOW', 'MED', 'HEIGH', 'SOME'];
  draggedTaskId: number | undefined;

  ngOnInit(): void {
    this.users$ = this.userService.getUsers().pipe(shareReplay(1));
    this.form = this.fb.group({
      description: ['', Validators.required],
      title: ['', [Validators.required]],
      taskStatus: [null, [Validators.required]],
      taskPriority: [null, Validators.required],
      users: [[], []],
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

  addTask(taskStatus: string): void {
    this.setShowModal(true);
    this.taskId = undefined;
    this.form.patchValue({ taskStatus });
  }
  edit(task: Partial<Task>): void {
    this.taskId = task.id;
    this.form.patchValue({
      ...task,
      users: (task.users ?? []).map((e) => Number(e.id)),
    });
    this.setShowModal(true);
  }

  deleteTask(taskId: number): void {
    this.taskService.delete(taskId).subscribe((a: any) => {
      this.searchChange.next('');
      this.setShowModal(false);
      this.messageService.add({
        severity: 'success',
        key: 'main',
        closable: true,
        summary: 'Task deleted',
      });
    });
  }

  setShowModal(newValue: boolean): void {
    this.showModal.set(newValue);
    if (!newValue) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.controls[key].markAsPristine();
        this.form.controls[key].markAsUntouched();
      });
    }
  }

  save(): void {
    (this.taskId
      ? this.taskService.put(this.taskId, this.mapFormValue())
      : this.taskService.post(this.mapFormValue())
    ).subscribe({
      next: (task: any) => {
        this.searchChange.next('');
        this.setShowModal(false);
        this.messageService.add({
          severity: 'success',
          key: 'main',
          closable: true,
          summary: this.taskId ? 'Task changed' : 'Task created',
        });
      },
    });
  }

  mapFormValue(): Partial<Task> {
    return {
      ...this.form.value,
      users: (this.form.value.users ?? []).map((id: number) => ({ id })),
    };
  }

  logout(): void {
    this.securityService.logout();
  }

  handleDrop(taskStatus: string): void {
    this.taskService
      .patch(this.draggedTaskId!, { taskStatus }).subscribe({
        next: () => {
          this.searchChange.next("");
        }
      })
  }
}


