import { BehaviorSubject, of } from 'rxjs';
import { SecurityService } from './security.service';
export class MockSecurityService {
    logout = jasmine.createSpy('logout');
    getCurrentUser = jasmine.createSpy('getCurrentUser').and.returnValue(of({ id: 1 }));
    user$ = new BehaviorSubject({
        id: 1,
        fullName: 'Pera Peric',
    });
}
export function provideSecurityService() {
    return { provide: SecurityService, useClass: MockSecurityService };
}
//# sourceMappingURL=mock-security.service.js.map