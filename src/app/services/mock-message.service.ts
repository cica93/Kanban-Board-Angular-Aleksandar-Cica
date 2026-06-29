import { Provider } from "@angular/core";
import { MessageService } from "primeng/api";
import { Subject } from "rxjs";

export class MockMessageService {
  messageObserver = new Subject<any>();
  clearObserver = new Subject<any>();

  add = jasmine.createSpy('add');
  clear = jasmine.createSpy('clear');
}

export function provideMockMessage(): Provider {
  return {
    provide: MessageService,
    useClass: MockMessageService,
  };
}
