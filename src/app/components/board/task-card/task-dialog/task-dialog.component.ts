import { Component, inject, OnInit, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  AbstractTaskService,
  Task,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from '@service/abstract.task.service';
import { firstValueFrom, Subject } from 'rxjs';
import { SubmitForm } from '@components/base-dialog/base-dialog.component';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { AsyncPipe } from '@angular/common';
import { AutoFocusModule } from 'primeng/autofocus';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormValueWrapperComponent } from 'src/app/form-value-wrapper/form-value-wrapper.component';
import { UserService } from '@service/user.service';
import { MultiSelect } from 'primeng/multiselect';
import { MessageHandlerService } from '@service/message.handler.service';
import { Location } from '@angular/common';

export type NoTUpdatableTaskFields =
  | 'id'
  | 'taskOrder'
  | 'version'
  | 'createdBy'
  | 'updatedBy';
export type TaskForm = Omit<Task, NoTUpdatableTaskFields>;
@Component({
  selector: 'app-task-dialog',
  imports: [
    DialogModule,
    FormRoot,
    DialogModule,
    InputTextModule,
    SelectModule,
    AutoFocusModule,
    FormField,
    FormValueWrapperComponent,
    MultiSelect,
    AsyncPipe,
  ],
  templateUrl: './task-dialog.component.html',
  host: {
    class: 'flex h-full',
  },
})
export class TaskDialogComponent implements SubmitForm, OnInit {
  initValue?: Task;
  submiting = new Subject<boolean>();
  modalHeader = new Subject<string>();
  onClose = new Subject<boolean>();
  private readonly taskService = inject(AbstractTaskService);
  private readonly location = inject(Location);
  private readonly messageHandlerService = inject(MessageHandlerService);
  users$ = inject(UserService).getUsers();
  TASK_STATUSES = TASK_STATUSES;
  TASK_PRIORITIES = TASK_PRIORITIES;
  protected model = signal<TaskForm>({
    description: '',
    taskPriority: this.TASK_PRIORITIES[0].value,
    taskStatus: this.TASK_STATUSES[0].value,
    title: '',
    users: [],
  });
  taskForm = form<TaskForm>(
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
            const id = this.initValue?.id ?? undefined;
            const formValue = this.taskForm().value();
            const savedTask = await firstValueFrom(
              id
                ? this.taskService.put(id, formValue)
                : this.taskService.post(formValue),
            );
            if (id) {
              this.taskService.taskChange.next({
                entity: { ...savedTask!, ...formValue },
                event: 'update',
              });
              this.showMessage('Task updated', 'Task updated successfully');
            } else {
              this.taskService.taskChange.next({
                entity: { ...savedTask!, ...formValue },
                event: 'create',
              });
              this.showMessage('Task Saved', 'Task saved successfully');
            }
            this.onClose.next(false);
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

  ngOnInit(): void {
    this.initValue = (this.location.getState() as any)?.['initValue'] as
      | Task
      | undefined;
    if (this.initValue) {
      this.model.set({
        ...this.model(),
        ...(this.initValue ?? {}),
        users: (this.initValue?.users ?? []).map((u) => ({
          ...u,
          id: Number(u.id),
        })),
      });
    }
    this.modalHeader.next(this.initValue?.id ? 'Edit Task' : 'Create Task');
  }

  submit(): Promise<boolean> {
    return submit(this.taskForm);
  }

  protected showMessage(summary: string, detail?: string): void {
    this.messageHandlerService.successEvent.next({
      summary,
      detail,
    });
  }
}
