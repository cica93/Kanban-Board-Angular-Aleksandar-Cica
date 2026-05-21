import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import {
  AbstractTaskService,
  Task,
} from 'src/app/services/abstract.task.service';
import { User, UserService } from 'src/app/services/user.service';
import { RippleModule } from 'primeng/ripple';
import { ReplacePipe } from 'src/app/pipes/replace.pipe';
import { firstValueFrom, Observable, shareReplay } from 'rxjs';
import { AutoFocusModule } from 'primeng/autofocus';
import { BaseDialogComponent } from 'src/app/components/base-dialog/base-dialog.component';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  required,
} from '@angular/forms/signals';
import { FormValueWrapperComponent } from 'src/app/form-value-wrapper/form-value-wrapper.component';

export const taskStatuses = ['TO_DO', 'IN_PROGRESS', 'DONE'];
export const taskPriorities = ['LOW', 'MED', 'HIGH'];

@Component({
  selector: 'app-task-dialog',
  imports: [
    Button,
    MultiSelect,
    DialogModule,
    InputTextModule,
    AsyncPipe,
    DropdownModule,
    RippleModule,
    ReplacePipe,
    AutoFocusModule,
    FormField,
    FormRoot,
    FormValueWrapperComponent,
  ],
  templateUrl: './task-dialog.component.html',
  host: {
    class: 'flex h-full',
  },
})
export class TaskDialogComponent extends BaseDialogComponent<Task> {
  private readonly taskService = inject(AbstractTaskService);
  private readonly userService = inject(UserService);
  readonly taskStatuses = taskStatuses;
  readonly taskPriorities = taskPriorities;
  protected users$!: Observable<User[]>;
  protected model = signal<Omit<Task, 'id'>>({
    description: '',
    taskPriority: this.taskPriorities[0],
    taskStatus: this.taskStatuses[0],
    title: '',
    users: [],
  });
  protected taskForm = form<Omit<Task, 'id'>>(
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
      required(path.users, {
        message: 'At least one user must be assigned to the task',
      });
    },
    {
      submission: {
        action: async () => {
          try {
            const id = this.initValue()?.id ?? undefined;
            const formValue = this.taskForm().value();
            await firstValueFrom(
              id
                ? this.taskService.put(id, formValue)
                : this.taskService.post(formValue),
            );
            this.messageService.add({
              severity: 'success',
              key: 'main',
              closable: true,
              summary: id ? 'Task updated' : 'Task created',
            });
            this.close(true);
            return undefined;
          } catch (error) {
            return {
              kind: 'Invalid email or password',
              message: 'invalid-credentials',
            };
          }
        },
        onInvalid: () => {
          this.taskForm().markAsTouched();
          this.taskForm().focusBoundControl();
        },
        ignoreValidators: 'none',
      },
    },
  );

  override ngOnInit(): void {
    super.ngOnInit();
    this.users$ = this.userService.getUsers().pipe(shareReplay());
    this.model.set({
      ...this.model(),
      ...this.initValue(),
      users:
        this.initValue()?.users.map((u) => ({ ...u, id: Number(u.id) })) ?? [],
    });
    this.modalHeader.next(this.initValue()?.id ? 'Edit Task' : 'Create Task');
  }
}
