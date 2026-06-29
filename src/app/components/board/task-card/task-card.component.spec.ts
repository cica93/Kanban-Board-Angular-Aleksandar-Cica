import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { TaskCardComponent } from './task-card.component';
import {
  Task,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from 'src/app/services/abstract.task.service';
import { By } from '@angular/platform-browser';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;
  let el: DebugElement; // DebugElement to query the DOM

  // Mock task data for testing
  const mockTask: Task = {
    id: 1,
    title: 'Implement User Authentication',
    description: 'Develop and integrate user authentication module with JWT.',
    taskStatus: TASK_STATUSES[0],
    taskPriority: TASK_PRIORITIES[0],
    users: [],
    version: 0,
    taskOrder: 0,
    createdBy: '',
    updatedBy: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent], // Assuming TaskCardComponent is a standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', mockTask);
    el = fixture.debugElement; // Assign DebugElement

    // Set the input property before the first change detection
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the task title', () => {
    const titleElement = el.query(By.css('#title-1')); // Assuming a class 'task-card-title'
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeElement.textContent).toContain(mockTask.title);
  });

  it('should display the task description', () => {
    const descriptionElement = el.query(By.css('#description-1')); // Assuming a class 'task-card-description'
    expect(descriptionElement).toBeTruthy();
    expect(descriptionElement.nativeElement.textContent).toContain(
      mockTask.description,
    );
  });

  it('should display the task status', () => {
    // This might be a class, a text, or a specific element
    const badge = fixture.debugElement.query(By.css('p-badge'));

    expect(badge.componentInstance.severity()).toBe('info');

    expect(badge.nativeElement.textContent).toContain(mockTask.taskPriority);
  });
});
