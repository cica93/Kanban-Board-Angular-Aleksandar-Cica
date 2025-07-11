import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AutoFocusModule } from 'primeng/autofocus';
import { BaseDialogComponent } from 'src/app/components/base-dialog/base-dialog.component';

@Component({
  selector: 'app-task-dialog',
  imports: [
    Button,
    MultiSelect,
    DialogModule,
    InputTextModule,
    AsyncPipe,
    DropdownModule,
    ReactiveFormsModule,
    RippleModule,
    ReplacePipe,
    AutoFocusModule,
  ],
  templateUrl: './task-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDialogComponent extends BaseDialogComponent<Task> {
  taskStatuses = ['TO_DO', 'IN_PROGRESS', 'DONE'];
  taskPriority = ['LOW', 'MED', 'HEIGH'];
  form!: FormGroup;
  users$!: Observable<User[]>;
  visibleSidebar = true;
  constructor(
    private taskService: AbstractTaskService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.form = this.fb.group(
      (this.users$ = this.userService.getUsers().pipe(shareReplay(1)))
    );
    this.form = this.fb.group({
      description: [this.initValue?.description, Validators.required],
      title: [this.initValue?.title, [Validators.required]],
      taskStatus: [this.initValue?.taskStatus, [Validators.required]],
      taskPriority: [this.initValue?.taskPriority, Validators.required],
      users: [
        (this.initValue?.users ?? []).map((user: User) => +user.id),
        [Validators.required],
      ],
    });
  }

  save(): void {
    (this.initValue?.id
      ? this.taskService.put(this.initValue?.id, this.mapFormValue())
      : this.taskService.post(this.mapFormValue())
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          key: 'main',
          closable: true,
          summary: this.initValue?.id ? 'Task updated' : 'Task created',
        });
        this.close(true);
      },
    });
  }

  mapFormValue(): Partial<Task> {
    return {
      ...this.form.value,
      users: (this.form.value.users ?? []).map((id: number) => ({ id })),
    };
  }

  public override getModalHeader(): string {
    return this.initValue?.id ? 'Edit task' : 'Create task';
  }
}
