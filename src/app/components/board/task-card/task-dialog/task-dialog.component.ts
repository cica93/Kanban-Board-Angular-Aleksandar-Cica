import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { SidebarModule } from 'primeng/sidebar';
import { Observable, shareReplay } from 'rxjs';
import { AbstractTaskService, Task } from 'src/app/services/abstract.task.service';
import { User, UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { Location } from '@angular/common';
import { ReplacePipe } from 'src/app/pipes/replace.pipe';

@Component({
  selector: 'app-task-dialog',
  imports: [
    Button,
    MultiSelect,
    SidebarModule,
    InputTextModule,
    AsyncPipe,
    DropdownModule,
    ReactiveFormsModule,
    RippleModule,
    ReplacePipe,
    PrimeTemplate
  ],
  templateUrl: './task-dialog.component.html',
})
export class TaskDialogComponent {

  taskStatuses = ['TO_DO', 'IN_PROGRESS', 'DONE'];
  taskPriority = ['LOW', 'MED', 'HEIGH'];
  form!: FormGroup;
  users$!: Observable<User[]>;
  initValue!: Partial<Task> 
  constructor(
    private taskService: AbstractTaskService,
    private messageService: MessageService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
  ) {}
 

  ngOnInit(): void {
    this.initValue = (this.location.getState() as any)?.['initValue'] ?? {};
    this.form = this.fb.group(
    this.users$ = this.userService.getUsers().pipe(shareReplay(1)));
    this.form = this.fb.group({
      description: [this.initValue.description, Validators.required],
      title: [this.initValue.title, [Validators.required]],
      taskStatus: [this.initValue.taskStatus, [Validators.required]],
      taskPriority: [this.initValue.taskPriority, Validators.required],
      users: [(this.initValue.users ?? []).map((user: User) => +user.id), [Validators.required]],
    });
  }
save(): void {
    (this.initValue.id
      ? this.taskService.put(this.initValue.id, this.mapFormValue())
      : this.taskService.post(this.mapFormValue())
    ).subscribe({
      next: (task: any) => {
        this.messageService.add({
          severity: 'success',
          key: 'main',
          closable: true,
          summary: this.initValue.id ? 'Task changed' : 'Task created',
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

  close(initNewSearch = false): void {
    this.router.navigate([{ outlets: { sidebar: null } }], { state: { initNewSearch } });
  }
}
