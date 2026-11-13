import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
export class MockRouter {
    navigate = jasmine.createSpy('navigate').and.returnValue(of({}));
    events = new Subject();
    url = '/';
    isActive() {
        return false;
    }
}
export function provideMockRouter() {
    return { provide: Router, useClass: MockRouter };
}
//# sourceMappingURL=mock-router.service.js.map