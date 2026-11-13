import { BehaviorSubject, of } from 'rxjs';
import { MessageHandlerService } from './message.handler.service';
export class MockMessageHandlerService {
    successEventAsObservable = jasmine.createSpy('getTasks').and.returnValue(of({})); // Return an empty object for initial state
    errorEventAsObservable = jasmine.createSpy('addTask').and.returnValue(of({}));
    successEvent = new BehaviorSubject({});
    errorEvent = new BehaviorSubject({});
}
export function provideMockMessageHandler() {
    return { provide: MessageHandlerService, useClass: MockMessageHandlerService };
}
//# sourceMappingURL=mock-message-handler.service.js.map