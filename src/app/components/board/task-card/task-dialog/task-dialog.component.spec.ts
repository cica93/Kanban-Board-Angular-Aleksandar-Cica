import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDialogComponent } from './task-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AbstractTaskService, Task } from 'src/app/services/abstract.task.service';
import { User, UserService } from 'src/app/services/user.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TaskDialogComponent', () => {
  let component: TaskDialogComponent;
  let fixture: ComponentFixture<TaskDialogComponent>;
  let taskService: jasmine.SpyObj<AbstractTaskService>;
  let userService: jasmine.SpyObj<UserService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let router: jasmine.SpyObj<Router>;
  let location: jasmine.SpyObj<Location>;

  const mockUsers = [
    { id: 1, name: 'User One' },
    { id: 2, name: 'User Two' },
  ] as unknown[] as User[];

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('AbstractTaskService', [
      'post',
      'put',
    ]);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const locationSpy = jasmine.createSpyObj('Location', ['getState']);

    await TestBed.configureTestingModule({
      declarations: [TaskDialogComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AbstractTaskService, useValue: taskServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore PrimeNG templates in unit tests
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDialogComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(
      AbstractTaskService
    ) as jasmine.SpyObj<AbstractTaskService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    messageService = TestBed.inject(
      MessageService
    ) as jasmine.SpyObj<MessageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    userService.getUsers.and.returnValue(of(mockUsers));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form from location state', () => {
    const initValue = {
      id: 5,
      title: 'Test Task',
      description: 'Test Desc',
      taskStatus: 'TO_DO',
      taskPriority: 'MED',
      users: [{ id: 1 }, { id: 2 }],
    };
    location.getState.and.returnValue({ initValue });

    component.ngOnInit();

    expect(component.form.value).toEqual({
      title: 'Test Task',
      description: 'Test Desc',
      taskStatus: 'TO_DO',
      taskPriority: 'MED',
      users: [1, 2],
    });
  });

  it('should call post when saving a new task', () => {
    location.getState.and.returnValue({});
    taskService.post.and.returnValue(of({} as unknown as Task));
    component.ngOnInit();

    component.form.setValue({
      title: 'New',
      description: 'Some desc',
      taskStatus: 'TO_DO',
      taskPriority: 'LOW',
      users: [1],
    });

    component.save();

    expect(taskService.post).toHaveBeenCalledWith({
      title: 'New',
      description: 'Some desc',
      taskStatus: 'TO_DO',
      taskPriority: 'LOW',
      users: [{ id: 1 } as unknown as User],
    });

    expect(messageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: 'success',
        summary: 'Task created',
      })
    );
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should call put when saving an existing task', () => {
    location.getState.and.returnValue({ initValue: { id: 99 } });
    taskService.put.and.returnValue(of({} as unknown as Task));
    component.ngOnInit();

    component.form.setValue({
      title: 'Edit',
      description: 'Updated desc',
      taskStatus: 'DONE',
      taskPriority: 'HEIGH',
      users: [2],
    });

    component.save();

    expect(taskService.put).toHaveBeenCalledWith(
      99,
      jasmine.objectContaining({
        title: 'Edit',
        description: 'Updated desc',
        users: [{ id: 2 }],
      })
    );
  });

  it('should close dialog and navigate with state', () => {
    component.close(true);
    expect(router.navigate).toHaveBeenCalledWith(
      [{ outlets: { sidebar: null } }],
      { state: { initNewSearch: true } }
    );
  });
});
