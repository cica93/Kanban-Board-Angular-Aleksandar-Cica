import { BehaviorSubject, of } from "rxjs";
import { User } from "./user.service";
import { SecurityService } from "./security.service";
import { Provider } from "@angular/core";

export class MockSecurityService {
  logout = jasmine.createSpy('logout');
  getCurrentUser = jasmine
    .createSpy('getCurrentUser')
    .and.returnValue(of({ id: 1 }));
  user$ = new BehaviorSubject<User>({
    id: 1,
    fullName: 'Pera Peric',
  } as User);
}

export function provideSecurityService(): Provider {
  return { provide: SecurityService, useClass: MockSecurityService }
}

