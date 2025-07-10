// src/app/components/board/task-card/task-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, signal } from '@angular/core';

import { TaskCardComponent } from './task-card.component';
import { Task } from 'src/app/services/abstract.task.service';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;
  let el: DebugElement; // DebugElement to query the DOM

  // Mock task data for testing
  const mockTask: Task = {
    id: 1,
    title: 'Implement User Authentication',
    description: 'Develop and integrate user authentication module with JWT.',
    taskStatus: 'IN_PROGRESS',
    taskPriority: 'LOW',
    users: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent] // Assuming TaskCardComponent is a standalone component
    })
    .compileComponents();

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
    const titleElement = el.query(By.css('.task-card-title')); // Assuming a class 'task-card-title'
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeElement.textContent).toContain(mockTask.title);
  });

  it('should display the task description', () => {
    const descriptionElement = el.query(By.css('.task-card-description')); // Assuming a class 'task-card-description'
    expect(descriptionElement).toBeTruthy();
    expect(descriptionElement.nativeElement.textContent).toContain(mockTask.description);
  });

  it('should display the task status', () => {
    // This might be a class, a text, or a specific element
    const statusElement = el.query(By.css('.task-card-status')); // Assuming a class 'task-card-status'
    expect(statusElement).toBeTruthy();
    expect(statusElement.nativeElement.textContent).toContain(mockTask.taskStatus);
  });

  it('should emit editTask event when edit button is clicked', () => {
    // Spy on the editTask EventEmitter
    spyOn(component.onDelete, 'emit');

    // Find the edit button (assuming it has a class 'edit-button')
    const editButton = el.query(By.css('.edit-button'));
    expect(editButton).toBeTruthy('Edit button not found. Ensure it has class "edit-button".');

    // Simulate a click event
    editButton.nativeElement.click();

    // Expect the emit method to have been called with the mock task
    expect(component.onEdit.emit).toHaveBeenCalledWith(mockTask);
  });

  // Example of testing conditional rendering (if applicable)
  it('should apply a specific class based on task status', () => {
    // Assuming your component adds a class like 'status-in-progress'
    const cardElement = el.query(By.css('.task-card')); // Assuming the main card element has 'task-card' class
    expect(cardElement).toBeTruthy();
    expect(cardElement.nativeElement.classList).toContain(`status-${mockTask.taskStatus}`);
  });
});
