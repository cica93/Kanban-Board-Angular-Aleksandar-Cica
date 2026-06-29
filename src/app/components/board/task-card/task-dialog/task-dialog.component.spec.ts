import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDialogComponent } from './task-dialog.component';
import { of } from 'rxjs';
import {
  AbstractTaskService,
  Task,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from 'src/app/services/abstract.task.service';
import { User, UserService } from 'src/app/services/user.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockUserService } from 'src/app/services/mock-user.service';
import { provideMockStore } from 'src/app/services/mock-store.service';

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
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const locationSpy = jasmine.createSpyObj('Location', ['getState']);

    await TestBed.configureTestingModule({
      imports: [TaskDialogComponent],
      providers: [
        { provide: AbstractTaskService, useValue: taskServiceSpy },
        provideMockUserService(),
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore PrimeNG templates in unit tests
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDialogComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(
      AbstractTaskService,
    ) as jasmine.SpyObj<AbstractTaskService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    messageService = TestBed.inject(
      MessageService,
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
      title: 'Test Task',
      description: 'Test Desc',
      taskStatus: TASK_STATUSES[1],
      taskPriority: TASK_PRIORITIES[2],
      users: [],
    };
    location.getState.and.returnValue({ initValue });

    component.ngOnInit();

    expect(component.taskForm().value()).toEqual({
      title: 'Test Task',
      description: 'Test Desc',
      taskStatus: TASK_STATUSES[1],
      taskPriority: TASK_PRIORITIES[2],
      users: [],
    });
  });

  it('should call post when saving a new task', async () => {
    location.getState.and.returnValue({});
    taskService.post.and.returnValue(of({} as unknown as Task));
    component.ngOnInit();

    component.taskForm().value.set({
      title: 'New',
      description: 'Some desc',
      taskStatus: TASK_STATUSES[2],
      taskPriority: TASK_PRIORITIES[1],
      users: [{ id: 1 } as User],
    });

    await submit(fixture);

    expect(taskService.post).toHaveBeenCalledWith({
      title: 'New',
      description: 'Some desc',
      taskStatus: TASK_STATUSES[2],
      taskPriority: TASK_PRIORITIES[1],
      users: [{ id: 1 } as unknown as User],
    });

    expect(messageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: 'success',
        summary: 'Task created',
      }),
    );
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should call put when saving an existing task', async () => {
    location.getState.and.returnValue({ initValue: { id: 99 } });
    taskService.put.and.returnValue(of({} as unknown as Task));
    component.ngOnInit();

    component.taskForm().value.set({
      title: 'Edit',
      description: 'Updated desc',
      taskStatus: TASK_STATUSES[2],
      taskPriority: TASK_PRIORITIES[0],
      users: [{ id: 2 } as User],
    });

    await submit(fixture);

    expect(taskService.put).toHaveBeenCalledWith(
      99,
      jasmine.objectContaining({
        title: 'Edit',
        description: 'Updated desc',
        taskStatus: TASK_STATUSES[2],
        taskPriority: TASK_PRIORITIES[0],
        users: [{ id: 2 }],
      }),
    );
  });
});

async function submit(
  fixture: ComponentFixture<TaskDialogComponent>,
): Promise<void> {
  (
    fixture.nativeElement.querySelector('#save-button') as HTMLButtonElement
  ).click();
  fixture.detectChanges();
  await fixture.whenStable();
}
