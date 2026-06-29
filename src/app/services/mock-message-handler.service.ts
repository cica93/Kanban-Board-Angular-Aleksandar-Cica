import { Provider } from "@angular/core";
import { BehaviorSubject, of } from "rxjs";
import { MessageHandlerService } from "./message.handler.service";

export class MockMessageHandlerService {
  successEventAsObservable = jasmine
    .createSpy('getTasks')
    .and.returnValue(of({})); // Return an empty object for initial state
  errorEventAsObservable = jasmine.createSpy('addTask').and.returnValue(of({}));
    successEvent = new BehaviorSubject<any>({});
    errorEvent = new BehaviorSubject<any>({});
}

export function provideMockMessageHandler(): Provider {
  return { provide: MessageHandlerService, useClass: MockMessageHandlerService }
}