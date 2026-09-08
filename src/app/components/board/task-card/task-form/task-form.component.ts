import {
  Component,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  AbstractTaskService,
  Task,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_STATUSES_OPTIONS,
  TaskStatus,
} from '@service/abstract.task.service';
import { firstValueFrom, Subject, zip } from 'rxjs';
import {
  SubmitForm,
  FORM_TOKEN,
} from '@components/shared/base-dialog/base-dialog.component';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  required,
  validate,
} from '@angular/forms/signals';
import { AsyncPipe } from '@angular/common';
import { FormValueWrapperComponent } from 'src/app/form-value-wrapper/form-value-wrapper.component';
import { User, UserService } from '@service/user.service';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MessageHandlerService } from '@service/message.handler.service';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';

export type NoTUpdatableTaskFields =
  | 'id'
  | 'taskOrder'
  | 'version'
  | 'createdBy'
  | 'updatedBy';
export type TaskForm = Omit<Task, NoTUpdatableTaskFields>;
@Component({
  selector: 'app-task-form',
  imports: [
    FormRoot,
    FormField,
    FormValueWrapperComponent,
    NgSelectModule,
    AsyncPipe,
    MatInput,
    MatLabel,
    MatFormField,
    MatError,
  ],
  templateUrl: './task-form.component.html',
  host: {
    class: 'flex h-full',
  },
  providers: [
    { provide: FORM_TOKEN, useClass: forwardRef(() => TaskFormComponent) },
  ],
})
export class TaskFormComponent implements SubmitForm<Task, TaskForm> {
  onClose: Subject<boolean> = new Subject<boolean>();
  initValue = input<Task | undefined | null>(null);
  private readonly taskService = inject(AbstractTaskService);
  private readonly messageHandlerService = inject(MessageHandlerService);
  users$ = inject(UserService).getUsers();
  TASK_STATUSES = TASK_STATUSES;
  TASK_PRIORITIES = TASK_PRIORITIES;
  TASK_STATUSES_OPTIONS = [...TASK_STATUSES_OPTIONS];

  usersSelect = viewChild('usersSelect', {
    read: NgSelectComponent,
  });
  protected model = signal<TaskForm>({
    description: '',
    taskPriority: this.TASK_PRIORITIES[0],
    taskStatus: this.TASK_STATUSES[0].replace(' ', '_') as TaskStatus,
    title: '',
    users: [],
  });

  constructor() {
    zip(
      this.users$,
      toObservable(this.usersSelect),
      toObservable(this.initValue),
      toObservable(this.initValue),
    ).subscribe(([users, select, initValue]) => {
      if (initValue) {
        this.model.set({
          description: initValue.description,
          taskPriority: initValue.taskPriority,
          taskStatus: initValue.taskStatus.replace(' ', '_') as TaskStatus,
          title: initValue.title,
          users: (initValue.users ?? []).map((user) => {
            const { __typename, ...userData } = user;
            return userData;
          }),
        });

        select?.writeValue(
          users.filter((user) =>
            initValue!.users.some(
              (selectedUser) => selectedUser.id === user.id,
            ),
          ),
        );
      } else {
        select?.writeValue([]);
      }
    });
  }

  form = form<TaskForm>(
    this.model,
    (path) => {
      required(path.title, { message: 'Title is required' });
      maxLength(path.title, 20, {
        message: 'Title must be less than 20 characters',
      });
      required(path.description, { message: 'Description is required' });
      minLength(path.description, 2, {
        message: 'Description must be at least 2 characters long',
      });
      maxLength(path.description, 50, {
        message: 'Description must be less than 50 characters',
      });
      required(path.taskStatus, { message: 'Task status is required' });
      required(path.taskPriority, { message: 'Task priority is required' });
      required(path.users, { message: 'Users are required' });
      validate(path.users, ({ value }) => {
        if (!value() || (Array.isArray(value()) && value().length === 0)) {
          return {
            kind: 'required',
            message: 'At least one user must be assigned to the task',
          };
        }
        return undefined;
      });
    },
    {
      submission: {
        action: async () => {
          try {
            const task = this.initValue() ?? {
              id: null,
              version: 0,
            };
            const { id, version } = task;
            const formValue = this.form().value();
            await firstValueFrom(
              id
                ? this.taskService.put(id, version, formValue)
                : this.taskService.post(formValue),
            );
            this.showMessage(
              `Task ${id ? 'updated' : 'created'}`,
              'Task changed successfully',
            );

            this.onClose.next(true);
            return undefined;
          } catch (error) {
            return {
              kind: 'Invalid email or password',
              message: 'invalid-credentials',
            };
          }
        },
        onInvalid: () => {
          this.form().markAsTouched();
          this.form().focusBoundControl();
        },
        ignoreValidators: 'none',
      },
    },
  );

  protected showMessage(summary: string, detail?: string): void {
    this.messageHandlerService.successEvent.next({
      summary,
      detail,
    });
  }

  compareWithId = (user: User | null, users: User[] | null): boolean => {
    console.log(user);
    if (!user || !users) {
      return false;
    }

    return users.some((u) => u.id === user.id);
  };
}
