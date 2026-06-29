import { of } from "rxjs";

export class MockTaskService {
  getTasks = jasmine.createSpy("getTasks").and.returnValue(of({})); // Return an empty object for initial state
  addTask = jasmine.createSpy("addTask").and.returnValue(of({}));
  deleteTask = jasmine.createSpy("deleteTask").and.returnValue(of({}));
  updateTask = jasmine.createSpy("updateTask").and.returnValue(of({}));
}