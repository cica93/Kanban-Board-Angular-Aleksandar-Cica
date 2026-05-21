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
import { map, Observable, shareReplay } from 'rxjs';
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
})
export class TaskDialogComponent extends BaseDialogComponent<Task> {
  readonly taskStatuses = ['TO_DO', 'IN_PROGRESS', 'DONE'];
  readonly taskPriorities = ['LOW', 'MED', 'HEIGH'];
  protected users$!: Observable<User[]>;
  protected model = signal<Omit<Task, 'id'>>({
    description: '',
    taskPriority: this.taskPriorities[0],
    taskStatus: this.taskStatuses[0],
    title: '',
    users: [],
  });
  protected taskForm = form<Omit<Task, 'id'>>(this.model, (path) => {
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
  });
  private readonly taskService = inject(AbstractTaskService);
  private readonly userService = inject(UserService);

  override ngOnInit(): void {
    super.ngOnInit();
    this.users$ = this.userService.getUsers().pipe(shareReplay());
    this.model.set({ ...this.model(), ...this.initValue() });
    this.modalHeader.next(this.initValue()?.id ? 'Edit Task' : 'Create Task');
  }

  save(): void {
    const id = this.initValue()?.id ?? undefined;
    (id
      ? this.taskService.put(id, this.mapFormValue())
      : this.taskService.post(this.mapFormValue())
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          key: 'main',
          closable: true,
          summary: id ? 'Task updated' : 'Task created',
        });
        this.close(true);
      },
    });
  }

  mapFormValue(): Partial<Task> {
    return {
      ...this.taskForm().value(),
    };
  }
}
