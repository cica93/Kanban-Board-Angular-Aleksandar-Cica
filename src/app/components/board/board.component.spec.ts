// import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
// import { BoardComponent } from './board.component';
// import {
//   ChangeDetectorRef,
//   DestroyRef,
//   NO_ERRORS_SCHEMA,
//   Pipe,
//   PipeTransform,
// } from '@angular/core';

// import { MessageService } from 'primeng/api';

// import { MockTaskService } from '@service/mock-task.service';
// import { AbstractTaskService } from '@service/abstract.task.service';
// import { Router } from '@angular/router';
// import { GroupAndSortTaskPipe } from 'src/app/pipes/group-and-sort-task.pipe';

// // Mock Pipes if they are custom pipes and affect rendering/logic
// @Pipe({ name: 'groupAndSortTask' })
// class GroupAndSortTaskPipeMock implements PipeTransform {
//   transform(value: any): any {
//     return value; // Simply return the value for testing
//   }
// }

// describe('BoardComponent', () => {
//   let component: BoardComponent;
//   let fixture: ComponentFixture<BoardComponent>;
//   let mockTaskService: MockTaskService;
//   let messageService: MessageService;
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [BoardComponent],
//       providers: [
//         Router,
//         DestroyRef,
//         ChangeDetectorRef,
//         MessageService,
//         { provide: GroupAndSortTaskPipe, useClass: GroupAndSortTaskPipeMock },
//         { provide: AbstractTaskService, useClass: MockTaskService },
//         // Provide the actual MessageService if used for toasts
//       ],
//       schemas: [NO_ERRORS_SCHEMA], // Use NO_ERRORS_SCHEMA to ignore unknown elements/attributes (e.g., appDebounceInput, pDroppable) if not testing them directly
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(BoardComponent);
//     component = fixture.componentInstance;
//     mockTaskService = TestBed.inject(
//       AbstractTaskService,
//     ) as unknown as MockTaskService;
//     messageService = TestBed.inject(MessageService); // Get the actual MessageService instance
//     fixture.detectChanges(); // Initial change detection to bind data
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should call searchChange.next with input value on search input change', fakeAsync(() => {
//     // const searchInput = fixture.debugElement.query(
//     //   By.css('input[pInputText][placeholder="Search"]'),
//     // );
//     // expect(searchInput).toBeTruthy();
//     // const testValue = 'test search';
//     // searchInput.nativeElement.value = testValue;
//     // searchInput.nativeElement.dispatchEvent(new Event('input')); // Simulate input event
//     // If appDebounceInput is a directive that debounces, you need to tick
//     // Assuming appDebounceInput emits on 'input' and then debounces internally
//     // You might need to trigger the custom event if appDebounceInput creates one
//     // For now, let's assume it's a standard input event that the directive listens to.
//     // If appDebounceInput uses a debounce time, you'd need to tick past that time
//     // For example, if debounce time is 300ms:
//     // tick(300);
//     // expect(component.searchChange.next).toHaveBeenCalledWith(testValue);
//     // Without knowing appDebounceInput's implementation, we can't precisely test its debounce.
//     // We can at least verify the input element exists.
//     // To properly test appDebounceInput, you'd need to mock or understand its output.
//     // For this example, we'll just ensure the input element is present.
//   }));

//   // it('should display task status sections based on tasks$', fakeAsync(() => {
//   //   const mockTasks = {
//   //     [TASK_STATUSES[0]]: [
//   //       { id: '1', title: 'Task 1', taskStatus: TASK_STATUSES[0] },
//   //     ],
//   //     [TASK_STATUSES[1]]: [
//   //       { id: '2', title: 'Task 2', taskStatus: TASK_STATUSES[1] },
//   //     ],
//   //   };
//   //   mockTaskService.getTasks.and.returnValue(of(mockTasks));
//   //   component.ngOnInit(); // Re-trigger ngOnInit to pick up new mock data
//   //   tick(); // Resolve the observable
//   //   fixture.detectChanges();

//   //   const todoSection = fixture.debugElement.query(By.css('h2 span.mr-2'));
//   //   expect(todoSection.nativeElement.textContent).toContain('TODO');

//   //   const inProgressSection = fixture.debugElement.queryAll(
//   //     By.css('h2 span.mr-2'),
//   //   )[1]; // Get the second h2
//   //   expect(inProgressSection.nativeElement.textContent).toContain(
//   //     'IN PROGRESS',
//   //   ); // Assuming replace pipe works

//   //   const taskCards = fixture.debugElement.queryAll(By.css('app-task-card'));
//   //   expect(taskCards.length).toBe(2); // One for TODO, one for IN_PROGRESS
//   // }));

//   // it('should show the sidebar modal when showModal is true', fakeAsync(() => {
//   //   component.showModal.set(true); // Set the signal to true
//   //   fixture.detectChanges();
//   //   tick(); // Allow async operations to complete

//   //   const sidebar = fixture.debugElement.query(By.css('p-sidebar'));
//   //   expect(sidebar).toBeTruthy();
//   //   expect(sidebar.nativeElement.classList).toContain('p-sidebar-active'); // Check for active class
//   // }));

//   // it('should hide the sidebar modal when showModal is false', fakeAsync(() => {
//   //   component.showModal.set(false); // Set the signal to false
//   //   fixture.detectChanges();
//   //   tick();

//   //   const sidebar = fixture.debugElement.query(By.css('p-sidebar'));
//   //   expect(sidebar).toBeNull(); // Sidebar should not be in the DOM
//   // }));

//   // Example of testing form input

//   // You would add more tests for:
//   // - deleteTask emission from app-task-card
//   // - editTask emission from app-task-card
//   // - handleDrop logic
//   // - Behavior of dropdowns and multi-select
//   // - Error handling and toast messages
// });
