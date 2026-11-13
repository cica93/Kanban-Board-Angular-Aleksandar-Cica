import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
export class MockMessageService {
    messageObserver = new Subject();
    clearObserver = new Subject();
    add = jasmine.createSpy('add');
    clear = jasmine.createSpy('clear');
}
export function provideMockMessage() {
    return {
        provide: MessageService,
        useClass: MockMessageService,
    };
}
//# sourceMappingURL=mock-message.service.js.map