import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FieldTree, FormField, FormRoot } from '@angular/forms/signals';
import { AutoFocusModule } from 'primeng/autofocus';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FormValueWrapperComponent } from 'src/app/form-value-wrapper/form-value-wrapper.component';
import { ReplacePipe } from 'src/app/pipes/replace.pipe';
import {
  TASK_STATUSES,
  TASK_PRIORITIES,
} from 'src/app/services/abstract.task.service';
import { UserService } from 'src/app/services/user.service';
import { TaskForm } from '../task-dialog.component';

@Component({
  selector: 'app-task-form',
  imports: [
    MultiSelect,
    DialogModule,
    InputTextModule,
    SelectModule,
    ReplacePipe,
    AutoFocusModule,
    TextareaModule,
    FormField,
    FormValueWrapperComponent,
    TextareaModule,
    AsyncPipe,
  ],
  templateUrl: './task-form.component.html',
  host: {
    class: 'flex flex-column gap-2',
  },
})
export class TaskFormComponent implements OnInit {
  protected TASK_STATUS = [...TASK_STATUSES];
  protected TASK_PRIORITIES = [...TASK_PRIORITIES];
  protected formRoot = inject(FormRoot<TaskForm>);
  protected taskForm!: FieldTree<TaskForm, string | number, 'writable'>;
  protected users$ = inject(UserService).getUsers();
  ngOnInit(): void {
    this.taskForm = this.formRoot.fieldTree();
  }
}
