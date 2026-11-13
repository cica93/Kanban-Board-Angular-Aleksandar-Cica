import { of } from 'rxjs';
import { UserService } from './user.service';
export class MockUserService {
    getUsers = jasmine.createSpy('getUsers').and.returnValue(of([])); // Return an empty array
}
export function provideMockUserService() {
    return { provide: UserService, useClass: MockUserService };
}
//# sourceMappingURL=mock-user.service.js.map