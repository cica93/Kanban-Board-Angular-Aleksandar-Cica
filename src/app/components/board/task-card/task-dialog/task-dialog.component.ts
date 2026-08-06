import { Component, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  AbstractTaskService,
  Task,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from '@service/abstract.task.service';
import { firstValueFrom } from 'rxjs';
import { BaseDialogComponent } from '@components/base-dialog/base-dialog.component';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  required,
  validate,
} from '@angular/forms/signals';
import { AppState, saveTask, updateTask } from 'src/app/store/task-store';
import { Store } from '@ngrx/store';
import { RippleModule } from 'primeng/ripple';
import { AsyncPipe } from '@angular/common';
import { AutoFocusModule } from 'primeng/autofocus';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormValueWrapperComponent } from 'src/app/form-value-wrapper/form-value-wrapper.component';
import { ReplacePipe } from 'src/app/pipes/replace.pipe';
import { UserService } from '@service/user.service';
import { ButtonModule } from 'primeng/button';
import { MultiSelect } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';

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
    ButtonModule,
    DialogModule,
    FormRoot,
    RippleModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ReplacePipe,
    AutoFocusModule,
    FormField,
    FormValueWrapperComponent,
    MultiSelect,
    TextareaModule,
    AsyncPipe,
  ],
  templateUrl: './task-dialog.component.html',
  host: {
    class: 'flex h-full',
  },
})
export class TaskDialogComponent extends BaseDialogComponent<Task> {
  private readonly taskService = inject(AbstractTaskService);
  private readonly store = inject(Store<AppState>);
  users$ = inject(UserService).getUsers();
  TASK_STATUSES = TASK_STATUSES;
  TASK_PRIORITIES = TASK_PRIORITIES;
  protected model = signal<TaskForm>({
    description: '',
    taskPriority: this.TASK_PRIORITIES[0],
    taskStatus: this.TASK_STATUSES[0],
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
            const id = this.initValue()?.id ?? undefined;
            const formValue = this.taskForm().value();
            const savedTask = await firstValueFrom(
              id
                ? this.taskService.put(id, formValue)
                : this.taskService.post(formValue),
            );
            if (id) {
              this.store.dispatch(
                updateTask({ data: { ...savedTask!, ...formValue } }),
              );
              this.showMessage('Task updated', 'Task updated successfully');
            } else {
              this.store.dispatch(
                saveTask({ data: { ...savedTask!, ...formValue } }),
              );
              this.showMessage('Task Saved', 'Task saved successfully');
            }
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
    this.model.set({
      ...this.model(),
      ...this.initValue(),
      users: (this.initValue()?.users ?? []).map((u) => ({
        ...u,
        id: Number(u.id),
      })),
    });
    this.modalHeader.next(this.initValue()?.id ? 'Edit Task' : 'Create Task');
  }
}
